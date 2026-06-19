import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

interface SettingsState {
  theme: Theme;
  language: string;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: string) => void;
  applySettings: (settings: Array<{ key: string; value: unknown }>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      language: "es",
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      applySettings: (settings) => {
        const patch: Partial<Pick<SettingsState, "theme" | "language">> = {};
        for (const s of settings) {
          if (
            s.key === "ui.theme" &&
            (s.value === "light" || s.value === "dark" || s.value === "system")
          )
            patch.theme = s.value;
          if (s.key === "ui.language" && typeof s.value === "string")
            patch.language = s.value;
        }
        if (Object.keys(patch).length > 0) set(patch);
      },
    }),
    { name: "basekit-settings" },
  ),
);
