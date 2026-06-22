import { useEffect } from "react";
import { useGetCurrentTenant } from "./queries/getCurrentTenant.query";
import { useGetGlobalSettings } from "#/modules/settings/queries/getGlobalSettings.query";
import { useTenantStore, type FeatureFlags } from "#/store/tenant.store";
import { useSettingsStore } from "#/store/settings.store";

interface AppDataLoaderProps {
  children: React.ReactNode;
}

export function AppDataLoader({ children }: AppDataLoaderProps) {
  const { data: tenantData, loading: tenantLoading } = useGetCurrentTenant();
  const { data: settingsData, loading: settingsLoading } =
    useGetGlobalSettings();
  const setTenant = useTenantStore((s) => s.setTenant);
  const applyGlobalSettings = useSettingsStore((s) => s.applyGlobalSettings);

  useEffect(() => {
    if (!tenantData?.currentTenant) return;
    const { id, slug, name, configuration } = tenantData.currentTenant;
    setTenant({
      id,
      slug,
      name,
      configuration,
      featureFlags: (configuration?.featureFlags as FeatureFlags) ?? {},
    });
  }, [tenantData, setTenant]);

  useEffect(() => {
    if (!settingsData?.globalSettings) return;
    applyGlobalSettings(settingsData.globalSettings);
  }, [settingsData, applyGlobalSettings]);

  if (tenantLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
