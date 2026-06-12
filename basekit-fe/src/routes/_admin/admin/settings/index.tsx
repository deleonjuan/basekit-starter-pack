import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/settings/")({
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Settings</h1>
    </div>
  );
}
