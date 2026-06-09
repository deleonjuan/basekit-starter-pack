import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { TenantModule } from "../tenant/tenant.module";

@Module({
  imports: [TenantModule],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
