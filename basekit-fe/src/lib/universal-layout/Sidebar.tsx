import type { ComponentType } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "#/components/ui/sidebar.tsx";

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
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <Link to={item.href}>
          {item.icon && <item.icon />}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function Sidebar({ items, footerItems = [] }: SidebarProps) {
  const { location } = useRouterState();

  return (
    <ShadcnSidebar collapsible="icon">
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
      <SidebarRail />
    </ShadcnSidebar>
  );
}
