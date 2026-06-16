import { AppPage } from "#/lib/universal-layout/";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <AppPage title="Dashboard">
      <p>Admin Dashboard</p>
    </AppPage>
  );
}
