/**
 * Creates a new tenant in the master database.
 *
 * When multitenancy is enabled, also provisions a dedicated database
 * (`tenant_<slug>`) and runs all migrations against it.
 *
 * @usage
 *   pnpm tenant:create --slug <slug> --name <name>
 *
 * @example
 *   pnpm tenant:create --slug acme --name "Acme Corp"
 *
 * @param --slug  URL-safe identifier for the tenant (must be unique)
 * @param --name  Human-readable display name for the tenant
 */
import { DataSource, DataSourceOptions } from "typeorm";
import {
  baseDataSourceOptions,
  masterDataSourceOptions,
} from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";
import config from "../config/config";

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].slice(2);
      result[key] =
        args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
    }
  }
  return result;
}

async function main(): Promise<void> {
  const { slug, name } = parseArgs();

  if (!slug || !name) {
    console.error(
      "Usage: pnpm tenant:create --slug <slug> --name <name>",
    );
    process.exit(1);
  }

  const masterDs = new DataSource(masterDataSourceOptions);
  await masterDs.initialize();

  const existing = await masterDs.getRepository(Tenant).findOneBy({ slug });
  if (existing) {
    console.error(`Tenant "${slug}" already exists`);
    await masterDs.destroy();
    process.exit(1);
  }

  const { enabled: multitenancyEnabled } = config().multitenancy;

  if (multitenancyEnabled) {
    const dbName = `tenant_${slug}`;

    const qr = masterDs.createQueryRunner();
    await qr.query(`CREATE DATABASE "${dbName}"`);
    await qr.release();
    console.log(`✓ Created database ${dbName}`);

    const tenantDs = new DataSource({
      ...(baseDataSourceOptions as any),
      database: dbName,
    } as DataSourceOptions);
    await tenantDs.initialize();
    await tenantDs.runMigrations();
    await tenantDs.destroy();
    console.log(`✓ Ran migrations on ${dbName}`);
  }

  const tenant = masterDs.getRepository(Tenant).create({
    slug,
    name,
    isActive: true,
  });
  const saved = await masterDs.getRepository(Tenant).save(tenant);
  console.log(
    `✓ Created tenant: ${saved.name} (slug: ${saved.slug}, id: ${saved.id})`,
  );

  await masterDs.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
