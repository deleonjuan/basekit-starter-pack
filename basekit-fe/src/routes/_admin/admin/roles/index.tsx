import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "#/modules/roles/roles.page";

export const Route = createFileRoute("/_admin/admin/roles/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
  }),
  component: function RolesRoute() {
    const { page } = Route.useSearch();
    return <RolesPage page={page} />;
  },
});
