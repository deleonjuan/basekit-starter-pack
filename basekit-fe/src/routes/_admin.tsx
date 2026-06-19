import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Key,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthGuard } from "#/modules/auth/components";
import { LayoutWrapper, type SidebarItem } from "#/lib/universal-layout";
import { SidebarMenuButton } from "#/components/ui/sidebar";
import { useGetCurrentUser } from "#/modules/auth/queries/getCurrentUser.query";
import { version } from "../../package.json";

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
  return (
    <SidebarMenuButton className="hover:bg-background active:bg-background">
      <span className="text-muted-foreground text-xs">{`v${version}`}</span>
    </SidebarMenuButton>
  );
}

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useTranslation();

  const adminNav: SidebarItem[] = [
    { label: t("nav.dashboard"), href: "/admin", icon: LayoutDashboard },
    { label: t("nav.users"), href: "/admin/users", icon: Users },
    { label: t("nav.roles"), href: "/admin/roles", icon: Key },
    { label: t("nav.settings"), href: "/admin/settings", icon: Settings },
  ];

  const adminFooter: SidebarItem[] = [
    { label: t("nav.logout"), href: "/logout", icon: LogOut },
    { label: "user", render: SidebarUserItem },
    { label: "version", render: Version },
  ];

  return (
    <AuthGuard>
      <LayoutWrapper sidebarItems={adminNav} footerItems={adminFooter}>
        <Outlet />
      </LayoutWrapper>
    </AuthGuard>
  );
}
