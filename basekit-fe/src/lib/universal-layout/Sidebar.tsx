import type { ComponentType } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/components/ui/sidebar.tsx";
import { Image, Typography } from "#/components/common";

type SidebarLinkItem = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  href: string;
  render?: never;
};

type SidebarRenderItem = {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  render: ComponentType;
  href?: never;
};

export type SidebarItem = SidebarLinkItem | SidebarRenderItem;

interface SidebarProps {
  items: SidebarItem[];
  footerItems?: SidebarItem[];
  headerLogo: string;
  headerTitle?: string;
}

function SidebarItemRow({
  item,
  isActive,
}: {
  item: SidebarItem;
  isActive?: boolean;
}) {
  if (item.render) {
    return (
      <SidebarMenuItem>
        <item.render />
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        className={`${isActive ? "text-primary!" : ""}`}
      >
        <Link to={item.href}>
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function Sidebar({
  items,
  footerItems = [],
  headerLogo,
  headerTitle,
}: SidebarProps) {
  const { location } = useRouterState();

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader className="bg-background mt-1 ps-2.5!">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-0 h-auto">
              <Image src={headerLogo} alt={headerTitle ?? "Logo"} size={38} />
              {headerTitle && (
                <Typography variant="title">{headerTitle}</Typography>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarItemRow
                  key={item.href ?? item.label}
                  item={item}
                  isActive={location.pathname === item.href}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {footerItems.length > 0 && (
        <SidebarFooter className="bg-background">
          <SidebarMenu>
            {footerItems.map((item) => (
              <SidebarItemRow key={item.href ?? item.label} item={item} />
            ))}
          </SidebarMenu>
        </SidebarFooter>
      )}
    </ShadcnSidebar>
  );
}
