import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface SettingsState {
  theme: Theme;
  language: string;
  globalSettings: Record<string, unknown>;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  applySettings: (settings: Array<{ key: string; value: unknown }>) => void;
  applyGlobalSettings: (
    settings: Array<{ key: string; value: unknown }>,
  ) => void;
}

export const useSettingsStore = create<SettingsState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        theme: "light",
        language: "es",
        globalSettings: {},
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        applySettings: (settings) => {
          const setPayload: any = {
            "ui.theme": (theme: Theme) => set({ theme }),
            "ui.language": (language: string) => set({ language }),
          };
          for (const s of settings) setPayload[s.key](s.value);
        },
        applyGlobalSettings: (settings) => {
          const globalSettings: Record<string, unknown> = {};
          for (const s of settings) {
            globalSettings[s.key] = s.value;
          }
          set({ globalSettings });
        },
      }),
      { name: "basekit-settings" },
    ),
  ),
);
