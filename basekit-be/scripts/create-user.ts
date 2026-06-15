import { DataSource, DataSourceOptions } from "typeorm";
import * as bcrypt from "bcrypt";
import {
  baseDataSourceOptions,
  masterDataSourceOptions,
} from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";
import { User } from "../src/user/entities/user.entity";
import config from "../config/config";

// Load .env before config() is evaluated inside main() (Node 20.12+)
(process as any).loadEnvFile?.();

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
  const { enabled: multitenancyEnabled } = config().multitenancy;

  if (!username || !password) {
    console.error(
      "Usage: pnpm user:create --username <name> --password <pass> [--super-admin] [--tenant <slug>]",
    );
    process.exit(1);
  }

  if (!isSuperAdmin && multitenancyEnabled && !tenantSlug) {
    console.error("--tenant <slug> is required when multitenancy is enabled");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const masterDs = new DataSource(masterDataSourceOptions);
  await masterDs.initialize();

  // Super admins always go in the master DB
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

  // Multitenancy disabled: write regular users to the master DB
  if (!multitenancyEnabled) {
    const user = masterDs.getRepository(User).create({
      username,
      password: hashedPassword,
      tenantId: null,
      isSuperAdmin: false,
      isActive: true,
    });
    const saved = await masterDs.getRepository(User).save(user);
    console.log(`✓ Created user: ${saved.username} (id: ${saved.id})`);
    await masterDs.destroy();
    return;
  }

  // Multitenancy enabled: verify tenant and write to the tenant DB
  const tenant = await masterDs
    .getRepository(Tenant)
    .findOneBy({ slug: tenantSlug, isActive: true });

  if (!tenant) {
    console.error(`Tenant "${tenantSlug}" not found or inactive`);
    await masterDs.destroy();
    process.exit(1);
  }

  const tenantDs = new DataSource({
    ...(baseDataSourceOptions as any),
    database: `tenant_${tenantSlug}`,
  } as DataSourceOptions);
  await tenantDs.initialize();

  const user = tenantDs.getRepository(User).create({
    username,
    password: hashedPassword,
    tenantId: tenant.id,
    isSuperAdmin: false,
    isActive: true,
  });
  const saved = await tenantDs.getRepository(User).save(user);
  console.log(
    `✓ Created user: ${saved.username} (id: ${saved.id}, tenant: ${tenantSlug})`,
  );

  await tenantDs.destroy();
  await masterDs.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
