import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleResolver } from "./role.resolver";
import { TenantModule } from "../tenant/tenant.module";

@Module({
  imports: [TenantModule],
  providers: [RoleService, RoleResolver],
  exports: [RoleService],
})
export class RoleModule {}
