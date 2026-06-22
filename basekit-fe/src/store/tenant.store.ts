import { create } from "zustand";

type FeatureFlagInde = "enableFirstUserCreation";

export type FeatureFlags = {
  enableFirstUserCreation: boolean;
};

export interface TenantData {
  id: string;
  slug: string;
  name: string;
  featureFlags: FeatureFlags;
  configuration: Record<string, unknown> | null;
}

interface TenantState {
  tenant: TenantData | null;
  setTenant: (tenant: TenantData) => void;
  // isFeatureEnabled: (key: string) => boolean;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenant: null,
  setTenant: (tenant) => set({ tenant }),
  isFeatureEnabled: (key: FeatureFlagInde) =>
    Boolean(get().tenant?.featureFlags?.[key] ?? false),
}));
