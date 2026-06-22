import { useSettingsStore } from "#/store/settings.store";
import { useTenantStore } from "#/store/tenant.store";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

export default function NavigationController({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const globalSettings = useSettingsStore((s) => s.globalSettings);
  const featureFlags = useTenantStore((s) => s.tenant?.featureFlags);

  const needsSetup =
    globalSettings["app.firstUserCreated"] === false &&
    featureFlags?.enableFirstUserCreation === true;

  const isOnSignup = location.pathname === "/signup";

  useEffect(() => {
    if (needsSetup && !isOnSignup) {
      navigate({ to: "/signup" });
    }
  }, [needsSetup, isOnSignup, navigate]);

  if (needsSetup && !isOnSignup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return <>{children}</>;
}
