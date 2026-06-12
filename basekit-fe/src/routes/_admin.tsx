import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AuthGuard } from "#/modules/auth/components";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AuthGuard requireAdmin>
      <Outlet />
    </AuthGuard>
  );
}
