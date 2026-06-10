import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "./tenant.entity";

import { TenantGuard } from "./tenant.guard";
import { tenantDataSourceProvider } from "./tenant.provider";
import { TenantService } from "./tenant.service";
import { TenantResolver } from "./tenant.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [
    TenantGuard,
    tenantDataSourceProvider,
    TenantService,
    TenantResolver,
  ],
  exports: [
    TenantGuard,
    tenantDataSourceProvider,
    TenantService,
    TypeOrmModule,
  ],
})
export class TenantModule {}
