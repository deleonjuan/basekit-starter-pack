import { AppPage } from "#/lib/universal-layout/";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/settings/")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AppPage title="Settings">
      <p>Settings page</p>
    </AppPage>
  );
}
