import { DataSource, DataSourceOptions } from "typeorm";
import {
  baseDataSourceOptions,
  masterDataSourceOptions,
} from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";

async function main(): Promise<void> {
  const registryDs = new DataSource(masterDataSourceOptions);
  await registryDs.initialize();
  console.log("Connected to master database");

  const tenants = await registryDs
    .getRepository(Tenant)
    .findBy({ isActive: true });

  console.log(`Found ${tenants.length} active tenant(s)`);

  for (const tenant of tenants) {
    const dbName = `tenant_${tenant.slug}`;
    const ds = new DataSource({
      ...(baseDataSourceOptions as any),
      database: dbName,
    } as DataSourceOptions);

    await ds.initialize();
    await ds.runMigrations();
    await ds.destroy();

    console.log(`✓ Migrated ${dbName}`);
  }

  await registryDs.destroy();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
