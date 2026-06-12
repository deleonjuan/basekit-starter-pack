/* eslint-disable */
import { BadRequestException } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Scope } from "@nestjs/common";
import { DataSource, DataSourceOptions } from "typeorm";
import { Request } from "express";
import { baseDataSourceOptions } from "../../database/datasource";
import config from "../../config/config";

export const TENANT_DATASOURCE = "TENANT_DATASOURCE";

const connectionCache = new Map<string, DataSource>();

export function evictTenantConnection(slug: string): void {
  const dbName = `tenant_${slug}`;
  const ds = connectionCache.get(dbName);
  if (ds) {
    ds.isInitialized && ds.destroy().catch(() => undefined);
    connectionCache.delete(dbName);
  }
}

const masterDs = new DataSource({
  ...baseDataSourceOptions,
  database: config().database.name,
} as DataSourceOptions);

export const tenantDataSourceProvider = {
  provide: TENANT_DATASOURCE,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: async (req: Request): Promise<DataSource> => {
    const { enabled } = config().multitenancy;

    if (!enabled) {
      if (!masterDs.isInitialized) await masterDs.initialize();
      return masterDs;
    }

    const slug = req["req"]["tenantSlug"];
    if (!slug) throw new Error("Tenant slug not resolved on request");

    if (!/^[a-z0-9_-]+$/.test(slug)) {
      throw new BadRequestException("Invalid tenant slug format");
    }

    const dbName = `tenant_${slug}`;

    if (connectionCache.has(dbName))
      return connectionCache.get(dbName) as DataSource;

    const ds = new DataSource({
      ...baseDataSourceOptions,
      database: dbName,
    } as DataSourceOptions);

    await ds.initialize();
    connectionCache.set(dbName, ds);
    return ds;
  },
};
