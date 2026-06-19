import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import SettingsTabs, { type Tabs } from "./components/SettingsTabs";
import SystemSettings from "./systemSettings.view";

interface AdminSettingsProps {
  view: string;
}

export default function AdminSettings({ view }: AdminSettingsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const settingsTabs: Tabs[] = [
    { value: "system", label: t("settings.tabs.system") },
  ];

  const handleViewChange = (newView: string) => {
    navigate({ to: "/admin/settings", search: { view: newView } });
  };

  return (
    <AppPage title={t("settings.page.title")}>
      <SettingsTabs
        className="mb-4"
        tabs={settingsTabs}
        value={view}
        onValueChange={handleViewChange}
      />
      {view === "system" && <SystemSettings />}
    </AppPage>
  );
}
