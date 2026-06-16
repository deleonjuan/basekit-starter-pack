import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Sidebar, type SidebarItem } from "./Sidebar";

interface LayoutWrapperProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
}

export function LayoutWrapper({ children, sidebarItems }: LayoutWrapperProps) {
  return (
    <SidebarProvider>
      <Sidebar items={sidebarItems} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
