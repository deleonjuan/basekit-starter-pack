import { useTranslation } from "react-i18next";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useSettingsStore, type Theme } from "#/store/settings.store";
import { useUpdatePersonalSetting } from "./queries/updatePersonalSetting.mutation";
import Setting from "./components/Setting";

function ThemeSetting() {
  const { t } = useTranslation();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const [updatePersonalSetting, { loading }] = useUpdatePersonalSetting();

  const handleChange = (value: Theme) => {
    setTheme(value);
    updatePersonalSetting({ variables: { input: { key: "ui.theme", value } } });
  };

  return (
    <Setting title={t("settings.theme.title")}>
      <div className="flex gap-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          disabled={loading}
          onClick={() => handleChange("light")}
        >
          {t("settings.theme.light")} <SunIcon />
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          disabled={loading}
          onClick={() => handleChange("dark")}
        >
          {t("settings.theme.dark")} <MoonIcon />
        </Button>
        <Button
          variant={theme === "system" ? "default" : "outline"}
          disabled={loading}
          onClick={() => handleChange("system")}
        >
          {t("settings.theme.system")} <MonitorIcon />
        </Button>
      </div>
    </Setting>
  );
}

function LanguageSetting() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const [updatePersonalSetting, { loading }] = useUpdatePersonalSetting();

  const handleChange = (value: string) => {
    setLanguage(value);
    updatePersonalSetting({
      variables: { input: { key: "ui.language", value } },
    });
  };

  return (
    <Setting title={t("settings.language.title")}>
      <div className="flex gap-2">
        <Button
          variant={language === "es" ? "default" : "outline"}
          disabled={loading}
          onClick={() => handleChange("es")}
        >
          {t("settings.language.es")}
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          disabled={loading}
          onClick={() => handleChange("en")}
        >
          {t("settings.language.en")}
        </Button>
      </div>
    </Setting>
  );
}

export default function SystemSettings() {
  return (
    <div className="flex flex-col gap-6">
      <ThemeSetting />
      <LanguageSetting />
    </div>
  );
}
