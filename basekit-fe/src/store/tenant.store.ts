import { create } from "zustand";

export interface TenantData {
  id: string;
  slug: string;
  name: string;
  featureFlags: Record<string, boolean>;
  configuration: Record<string, unknown> | null;
}

interface TenantState {
  tenant: TenantData | null;
  setTenant: (tenant: TenantData) => void;
  isFeatureEnabled: (key: string) => boolean;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  tenant: null,
  setTenant: (tenant) => set({ tenant }),
  isFeatureEnabled: (key) =>
    Boolean(get().tenant?.featureFlags?.[key] ?? false),
}));
