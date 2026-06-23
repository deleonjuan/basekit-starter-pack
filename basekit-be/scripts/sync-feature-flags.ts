/* eslint-disable */
/**
 * Syncs feature flags from `config/feature-flags.json` to every tenant record
 * in the master database.
 *
 * For each tenant:
 *   - Adds any new flags (using the default value from the registry).
 *   - Removes flags that no longer exist in the registry.
 *   - Preserves existing per-tenant overrides for flags still in the registry.
 *
 * Safe to run multiple times — already-synced tenants are updated in place
 * without losing their custom flag values.
 *
 * @usage
 *   pnpm flags:sync
 *
 * @example
 *   pnpm flags:sync
 */
import { DataSource } from "typeorm";
import { masterDataSourceOptions } from "../database/datasource";
import { Tenant } from "../src/tenant/tenant.entity";
import flagRegistry from "../config/feature-flags.json";

const defaults: Record<string, boolean> = Object.fromEntries(
  flagRegistry.flags.map((f) => [f.key, f.default]),
);
const registryKeys = new Set(flagRegistry.flags.map((f) => f.key));

async function main(): Promise<void> {
  const ds = new DataSource(masterDataSourceOptions);
  await ds.initialize();
  console.log("Connected to master database");

  const tenants = await ds.getRepository(Tenant).find();
  console.log(`Found ${tenants.length} tenant(s)`);

  for (const tenant of tenants) {
    const existing: Record<string, boolean> =
      tenant.configuration?.featureFlags ?? {};

    // Preserve per-tenant overrides only for flags still in the registry
    const filteredOverrides = Object.fromEntries(
      Object.entries(existing).filter(([k]) => registryKeys.has(k)),
    );

    const merged = { ...defaults, ...filteredOverrides };

    tenant.configuration = {
      ...tenant.configuration,
      featureFlags: merged,
    };

    await ds.getRepository(Tenant).save(tenant);

    const added = flagRegistry.flags
      .filter((f) => !(f.key in existing))
      .map((f) => f.key);
    const removed = Object.keys(existing).filter((k) => !registryKeys.has(k));

    console.log(
      `✓ ${tenant.slug}` +
        (added.length ? `  +[${added.join(", ")}]` : "") +
        (removed.length ? `  -[${removed.join(", ")}]` : ""),
    );
  }

  await ds.destroy();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
