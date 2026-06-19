import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from "@nestjs/common";
import { DataSource } from "typeorm";
import { TENANT_DATASOURCE } from "../tenant/tenant.provider";
import { Setting } from "./entities/setting.entity";
import {
  SETTINGS_REGISTRY,
  SettingDefinition,
} from "./registry/settings.registry";
import { SettingType } from "./dto/setting.type";

function resolveSettings(
  definitions: SettingDefinition[],
  rows: Setting[],
): SettingType[] {
  const rowMap = new Map(rows.map((r) => [r.key, r]));
  return definitions.map((def) => ({
    key: def.key,
    scope: def.scope,
    type: def.type,
    label: def.label,
    description: def.description,
    options: def.options,
    value: rowMap.has(def.key) ? rowMap.get(def.key)!.value : def.default,
    isDefault: !rowMap.has(def.key),
  }));
}

function validateValue(def: SettingDefinition, value: unknown): void {
  switch (def.type) {
    case "string":
      if (typeof value !== "string")
        throw new BadRequestException(
          `Setting "${def.key}" requires a string value`,
        );
      break;
    case "boolean":
      if (typeof value !== "boolean")
        throw new BadRequestException(
          `Setting "${def.key}" requires a boolean value`,
        );
      break;
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value))
        throw new BadRequestException(
          `Setting "${def.key}" requires a finite number value`,
        );
      break;
    case "select":
      if (!def.options?.includes(value as string))
        throw new BadRequestException(
          `Setting "${def.key}" must be one of: ${def.options?.join(", ")}`,
        );
      break;
  }
}

@Injectable({ scope: Scope.REQUEST })
export class SettingsService {
  constructor(@Inject(TENANT_DATASOURCE) private readonly ds: DataSource) {}

  // ── Global ────────────────────────────────────────────────────────────────

  async getGlobalSettings(): Promise<SettingType[]> {
    const defs = SETTINGS_REGISTRY.filter((d) => d.scope === "global");
    const rows = await this.ds
      .getRepository(Setting)
      .find({ where: { scope: "global" } });
    return resolveSettings(defs, rows);
  }

  async updateGlobalSetting(key: string, value: unknown): Promise<SettingType> {
    const def = SETTINGS_REGISTRY.find(
      (d) => d.key === key && d.scope === "global",
    );
    if (!def) throw new NotFoundException(`Global setting "${key}" not found`);
    validateValue(def, value);

    await this.ds.query(
      `INSERT INTO settings (id, key, value, scope, user_id, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2::jsonb, 'global', NULL, NOW(), NOW())
       ON CONFLICT (key) WHERE scope = 'global'
       DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
      [key, JSON.stringify(value)],
    );

    return { ...def, value, isDefault: false };
  }

  async resetGlobalSetting(key: string): Promise<SettingType> {
    const def = SETTINGS_REGISTRY.find(
      (d) => d.key === key && d.scope === "global",
    );
    if (!def) throw new NotFoundException(`Global setting "${key}" not found`);

    await this.ds.getRepository(Setting).delete({ key, scope: "global" });

    return { ...def, value: def.default, isDefault: true };
  }

  // ── Personal ──────────────────────────────────────────────────────────────

  async getPersonalSettings(userId: string): Promise<SettingType[]> {
    const defs = SETTINGS_REGISTRY.filter((d) => d.scope === "personal");
    const rows = await this.ds
      .getRepository(Setting)
      .find({ where: { scope: "personal", userId } });
    return resolveSettings(defs, rows);
  }

  async updatePersonalSetting(
    userId: string,
    key: string,
    value: unknown,
  ): Promise<SettingType> {
    const def = SETTINGS_REGISTRY.find(
      (d) => d.key === key && d.scope === "personal",
    );
    if (!def)
      throw new NotFoundException(`Personal setting "${key}" not found`);
    validateValue(def, value);

    await this.ds.query(
      `INSERT INTO settings (id, key, value, scope, user_id, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2::jsonb, 'personal', $3, NOW(), NOW())
       ON CONFLICT (key, user_id) WHERE scope = 'personal'
       DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
      [key, JSON.stringify(value), userId],
    );

    return { ...def, value, isDefault: false };
  }

  async resetPersonalSetting(
    userId: string,
    key: string,
  ): Promise<SettingType> {
    const def = SETTINGS_REGISTRY.find(
      (d) => d.key === key && d.scope === "personal",
    );
    if (!def)
      throw new NotFoundException(`Personal setting "${key}" not found`);

    await this.ds
      .getRepository(Setting)
      .delete({ key, scope: "personal", userId });

    return { ...def, value: def.default, isDefault: true };
  }
}
