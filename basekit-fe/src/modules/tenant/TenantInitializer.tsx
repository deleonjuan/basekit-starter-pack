import { useEffect, useRef } from "react";
import { useGetCurrentTenant } from "./queries/getCurrentTenant.query";
import { useGetGlobalSettings } from "#/modules/settings/queries/getGlobalSettings.query";
import { useTenantStore, type FeatureFlags } from "#/store/tenant.store";
import { useSettingsStore } from "#/store/settings.store";

export function TenantInitializer() {
  const { data: tenantData } = useGetCurrentTenant();
  const { data: settingsData } = useGetGlobalSettings();
  const setTenant = useTenantStore((s) => s.setTenant);
  const applyGlobalSettings = useSettingsStore((s) => s.applyGlobalSettings);
  const tenantApplied = useRef(false);
  const settingsApplied = useRef(false);

  useEffect(() => {
    if (!tenantData?.currentTenant || tenantApplied.current) return;
    tenantApplied.current = true;
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
    if (!settingsData?.globalSettings || settingsApplied.current) return;
    settingsApplied.current = true;
    applyGlobalSettings(settingsData.globalSettings);
  }, [settingsData, applyGlobalSettings]);

  return null;
}
