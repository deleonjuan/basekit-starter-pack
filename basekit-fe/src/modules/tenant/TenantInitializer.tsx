import { useEffect, useRef } from "react";
import { useGetCurrentTenant } from "./queries/getCurrentTenant.query";
import { useTenantStore } from "#/store/tenant.store";

export function TenantInitializer() {
  const { data } = useGetCurrentTenant();
  const setTenant = useTenantStore((s) => s.setTenant);
  const applied = useRef(false);

  useEffect(() => {
    if (!data?.currentTenant || applied.current) return;
    applied.current = true;
    const { id, slug, name, configuration } = data.currentTenant;
    setTenant({
      id,
      slug,
      name,
      configuration,
      featureFlags:
        (configuration?.featureFlags as Record<string, boolean>) ?? {},
    });
  }, [data, setTenant]);

  return null;
}
