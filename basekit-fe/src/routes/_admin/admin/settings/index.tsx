import AdminSettings from "#/modules/settings/settings.page.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/settings/")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: String(search.view ?? "system"),
  }),
  component: function SettingsRoute() {
    const { view } = Route.useSearch();
    return <AdminSettings view={view} />;
  },
});
