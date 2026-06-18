import { useNavigate } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import SettingsTabs, { type Tabs } from "./components/SettingsTabs";
import SystemSettings from "./systemSettings.view";

const settingsTabs: Tabs[] = [
  {
    value: "system",
    label: "Sistema",
  },
];

interface AdminSettingsProps {
  view: string;
}

export default function AdminSettings({ view }: AdminSettingsProps) {
  const navigate = useNavigate();

  const handleViewChange = (newView: string) => {
    navigate({ to: "/admin/settings", search: { view: newView } });
  };

  return (
    <AppPage title="Settings">
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
