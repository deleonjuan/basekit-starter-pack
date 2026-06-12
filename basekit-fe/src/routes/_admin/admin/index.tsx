import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </div>
  );
}
