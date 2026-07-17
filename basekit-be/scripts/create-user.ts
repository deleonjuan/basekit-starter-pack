/**
 * Creates a new user (regular or super admin) in the appropriate database.
 *
 * - Super admins are always written to the master database regardless of
 *   multitenancy mode.
 * - With multitenancy disabled, regular users are written to the master DB.
 * - With multitenancy enabled, regular users are written to the tenant DB
 *   (`tenant_<slug>`); --tenant is required in this case.
 *
 * @usage
 *   pnpm user:create --username <name> --password <pass> [--super-admin] [--tenant <slug>]
 *
 * @example
 *   pnpm user:create --username alice --password secret123
 *   pnpm user:create --username alice --password secret123 --tenant acme
 *   pnpm user:create --username admin --password secret123 --super-admin
 *
 * @param --username     Login name for the new user
 * @param --password     Plain-text password (hashed with bcrypt before storing)
 * @param --super-admin  Flag: creates the user as a super admin (no tenant required)
 * @param --tenant       Tenant slug; required for regular users when multitenancy is enabled
 */
import { DataSource, DataSourceOptions } from "typeorm";
import * as bcrypt from "bcrypt";
import {
  baseDataSourceOptions,
  masterDataSourceOptions,
} from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";
import { User } from "../src/user/entities/user.entity";
import config from "../config/config";

// Load .env before config() is evaluated inside main() (Node 20.12+).
// In Docker, env vars are injected directly and there is no .env file on disk.
try {
  (process as any).loadEnvFile?.();
} catch (err: any) {
  if (err?.code !== "ENOENT") throw err;
}

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
