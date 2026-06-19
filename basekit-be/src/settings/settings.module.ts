import { Module } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { SettingsResolver } from "./settings.resolver";
import { TenantModule } from "../tenant/tenant.module";

@Module({
  imports: [TenantModule],
  providers: [SettingsService, SettingsResolver],
})
export class SettingsModule {}
