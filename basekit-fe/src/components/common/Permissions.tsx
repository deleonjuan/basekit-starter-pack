import type React from "react";
import { useUserStore } from "#/store/user.store";
import { ForbiddenScreen } from "#/components/screens/ForbiddenScreen";

function useHasPermissions(required: string[]): boolean {
  const user = useUserStore((s) => s.user);
  if (!user) return false;
  if (user.isSuperAdmin) return true;
  const granted = new Set(
    user.roles.flatMap((r) => r.permissions.map((p) => p.value)),
  );
  return required.every((p) => granted.has(p));
}

interface PermissionsProps {
  required: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Permissions({
  required,
  children,
  fallback = null,
}: PermissionsProps) {
  const allowed = useHasPermissions(required);
  return allowed ? <>{children}</> : <>{fallback}</>;
}

export function withPermissions<P extends object>(
  Component: React.ComponentType<P>,
  required: string[],
  fallback: React.ReactNode = <ForbiddenScreen />,
): React.FC<P> {
  function PermissionWrapper(props: P) {
    const allowed = useHasPermissions(required);
    return allowed ? <Component {...props} /> : <>{fallback}</>;
  }
  PermissionWrapper.displayName = `withPermissions(${Component.displayName ?? Component.name})`;
  return PermissionWrapper;
}
