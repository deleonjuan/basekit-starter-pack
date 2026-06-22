export type SettingType = "string" | "boolean" | "number" | "select";
export type SettingScope = "global" | "personal";

export interface SettingDefinition {
  key: string;
  scope: SettingScope;
  type: SettingType;
  default: unknown;
  label: string;
  description?: string;
  options?: string[];
  permission?: string;
}

export const SETTINGS_REGISTRY: SettingDefinition[] = [
  // ── Global ───────────────────────────────────────────────────────────────
  {
    key: "app.name",
    scope: "global",
    type: "string",
    default: "BaseKit",
    label: "App name",
    description: "Display name shown in the UI.",
    permission: "settings.global:write",
  },
  {
    key: "app.firstUserCreated",
    scope: "global",
    type: "string",
    default: false,
    label: "First user has been created",
    description: "Set to true automatically after the first user registers.",
    permission: "settings.global:write",
  },

  // ── Personal ─────────────────────────────────────────────────────────────
  {
    key: "ui.theme",
    scope: "personal",
    type: "select",
    default: "system",
    options: ["light", "dark", "system"],
    label: "Theme",
  },
  {
    key: "ui.language",
    scope: "personal",
    type: "select",
    default: "es",
    options: ["es", "en"],
    label: "Language",
  },
];
