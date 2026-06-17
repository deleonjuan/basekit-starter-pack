import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Key, LayoutDashboard, Settings, Users } from "lucide-react";
import { AuthGuard } from "#/modules/auth/components";
import { LayoutWrapper, type SidebarItem } from "#/lib/universal-layout";

const ADMIN_NAV: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Roles", href: "/admin/roles", icon: Key },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AuthGuard>
      <LayoutWrapper sidebarItems={ADMIN_NAV}>
        <Outlet />
      </LayoutWrapper>
    </AuthGuard>
  );
}
