import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Key,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { AuthGuard } from "#/modules/auth/components";
import { LayoutWrapper, type SidebarItem } from "#/lib/universal-layout";
import { SidebarMenuButton } from "#/components/ui/sidebar";
import { useGetCurrentUser } from "#/modules/auth/queries/getCurrentUser.query";
import { version } from "../../package.json";

const ADMIN_NAV: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Roles", href: "/admin/roles", icon: Key },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function SidebarUserItem() {
  const { data } = useGetCurrentUser();
  const username = data?.me?.username ?? "...";
  return (
    <SidebarMenuButton
      tooltip={username}
      className="hover:bg-background active:bg-background"
    >
      <UserCircle />
      <span>{username}</span>
    </SidebarMenuButton>
  );
}

function Version() {
  const { data } = useGetCurrentUser();
  const username = data?.me?.username ?? "...";
  return (
    <SidebarMenuButton
      tooltip={username}
      className="hover:bg-background active:bg-background"
    >
      <span className="text-muted-foreground text-xs">{`v${version}`}</span>
    </SidebarMenuButton>
  );
}

const ADMIN_FOOTER: SidebarItem[] = [
  { label: "Cerrar sesión", href: "/logout", icon: LogOut },
  { label: "Usuario", render: SidebarUserItem },
  { label: "version", render: Version },
];

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AuthGuard>
      <LayoutWrapper sidebarItems={ADMIN_NAV} footerItems={ADMIN_FOOTER}>
        <Outlet />
      </LayoutWrapper>
    </AuthGuard>
  );
}
