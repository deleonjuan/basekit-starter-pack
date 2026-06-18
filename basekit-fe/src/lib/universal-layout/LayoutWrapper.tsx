import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Sidebar, type SidebarItem } from "./Sidebar";

interface LayoutWrapperProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  footerItems?: SidebarItem[];
}

export function LayoutWrapper({
  children,
  sidebarItems,
  footerItems,
}: LayoutWrapperProps) {
  return (
    <SidebarProvider>
      <Sidebar items={sidebarItems} footerItems={footerItems} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
