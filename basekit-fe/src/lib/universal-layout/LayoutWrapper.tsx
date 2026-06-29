import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar.tsx";
import { Sidebar, type SidebarItem } from "./Sidebar";

interface LayoutWrapperProps {
  children: ReactNode;
  sidebarItems: SidebarItem[];
  footerItems?: SidebarItem[];
  headerLogo: string;
  headerTitle?: string;
}

export function LayoutWrapper({
  children,
  sidebarItems,
  footerItems,
  headerLogo,
  headerTitle,
}: LayoutWrapperProps) {
  return (
    <SidebarProvider>
      <Sidebar
        items={sidebarItems}
        footerItems={footerItems}
        headerLogo={headerLogo}
        headerTitle={headerTitle}
      />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
