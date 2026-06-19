import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useSettingsStore, type Theme } from "#/store/settings.store";
import { useUpdatePersonalSetting } from "./queries/updatePersonalSetting.mutation";
import Setting from "./components/Setting";

export default function SystemSettings() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const [updatePersonalSetting, { loading }] = useUpdatePersonalSetting();

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
    updatePersonalSetting({ variables: { input: { key: "ui.theme", value } } });
  };

  return (
    <>
      <Setting title="Tema">
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            disabled={loading}
            onClick={() => handleThemeChange("light")}
          >
            Claro <SunIcon />
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            disabled={loading}
            onClick={() => handleThemeChange("dark")}
          >
            Oscuro <MoonIcon />
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            disabled={loading}
            onClick={() => handleThemeChange("system")}
          >
            Sistema <MonitorIcon />
          </Button>
        </div>
      </Setting>
    </>
  );
}
