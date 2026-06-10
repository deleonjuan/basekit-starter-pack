import { DataSource, DataSourceOptions } from "typeorm";
import * as bcrypt from "bcrypt";
import {
  baseDataSourceOptions,
  masterDataSourceOptions,
} from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";
import { User } from "../src/user/entities/user.entity";
import config from "../config/config";

function parseArgs(): Record<string, string | boolean> {
  const args = process.argv.slice(2);
  const result: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      if (args[i + 1] && !args[i + 1].startsWith("--")) {
        result[key] = args[++i];
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

async function main(): Promise<void> {
  const args = parseArgs();
  const username = args.username as string;
  const password = args.password as string;
  const isSuperAdmin =
    args["super-admin"] === true || args["super-admin"] === "true";
  const tenantSlug = args.tenant as string | undefined;

  if (!username || !password) {
    console.error(
      "Usage: pnpm user:create --username <name> --password <pass> [--super-admin] [--tenant <slug>]",
    );
    process.exit(1);
  }

  if (!isSuperAdmin && !tenantSlug) {
    console.error("--tenant <slug> is required for non-super-admin users");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const masterDs = new DataSource(masterDataSourceOptions);
  await masterDs.initialize();

  if (isSuperAdmin) {
    const user = masterDs.getRepository(User).create({
      username,
      password: hashedPassword,
      tenantId: null,
      isSuperAdmin: true,
      isActive: true,
    });
    const saved = await masterDs.getRepository(User).save(user);
    console.log(`✓ Created super admin: ${saved.username} (id: ${saved.id})`);
    await masterDs.destroy();
    return;
  }

  const tenant = await masterDs
    .getRepository(Tenant)
    .findOneBy({ slug: tenantSlug, isActive: true });

  if (!tenant) {
    console.error(`Tenant "${tenantSlug}" not found or inactive`);
    await masterDs.destroy();
    process.exit(1);
  }

  const { enabled: multitenancyEnabled } = config().multitenancy;

  let userDs: DataSource;
  if (multitenancyEnabled) {
    userDs = new DataSource({
      ...(baseDataSourceOptions as any),
      database: `tenant_${tenantSlug}`,
    } as DataSourceOptions);
    await userDs.initialize();
  } else {
    userDs = masterDs;
  }

  const user = userDs.getRepository(User).create({
    username,
    password: hashedPassword,
    tenantId: tenant.id,
    isSuperAdmin: false,
    isActive: true,
  });
  const saved = await userDs.getRepository(User).save(user);
  console.log(
    `✓ Created user: ${saved.username} (id: ${saved.id}, tenant: ${tenantSlug})`,
  );

  if (multitenancyEnabled) await userDs.destroy();
  await masterDs.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
