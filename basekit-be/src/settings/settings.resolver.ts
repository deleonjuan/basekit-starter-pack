import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SettingsService } from "./settings.service";
import { SettingType } from "./dto/setting.type";
import { UpdateSettingInput } from "./dto/update-setting.input";
import { RequirePermissions } from "../auth/decorators/permissions.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import type { JwtPayload } from "../auth/jwt.strategy";

@Resolver()
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Query(() => [SettingType], { name: "globalSettings" })
  @RequirePermissions("settings.global:read")
  getGlobalSettings(): Promise<SettingType[]> {
    return this.settingsService.getGlobalSettings();
  }

  @Mutation(() => SettingType, { name: "updateGlobalSetting" })
  @RequirePermissions("settings.global:write")
  updateGlobalSetting(
    @Args("input") input: UpdateSettingInput,
  ): Promise<SettingType> {
    return this.settingsService.updateGlobalSetting(input.key, input.value);
  }

  @Mutation(() => SettingType, { name: "resetGlobalSetting" })
  @RequirePermissions("settings.global:write")
  resetGlobalSetting(@Args("key") key: string): Promise<SettingType> {
    return this.settingsService.resetGlobalSetting(key);
  }

  @Query(() => [SettingType], { name: "personalSettings" })
  getPersonalSettings(@CurrentUser() user: JwtPayload): Promise<SettingType[]> {
    return this.settingsService.getPersonalSettings(user.sub);
  }

  @Mutation(() => SettingType, { name: "updatePersonalSetting" })
  updatePersonalSetting(
    @CurrentUser() user: JwtPayload,
    @Args("input") input: UpdateSettingInput,
  ): Promise<SettingType> {
    return this.settingsService.updatePersonalSetting(
      user.sub,
      input.key,
      input.value,
    );
  }

  @Mutation(() => SettingType, { name: "resetPersonalSetting" })
  resetPersonalSetting(
    @CurrentUser() user: JwtPayload,
    @Args("key") key: string,
  ): Promise<SettingType> {
    return this.settingsService.resetPersonalSetting(user.sub, key);
  }
}
