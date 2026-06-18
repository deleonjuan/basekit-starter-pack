import { UsersPage } from "#/modules/users/users.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/users/")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
  }),
  component: function UsersRoute() {
    const { page } = Route.useSearch();
    return <UsersPage page={page} />;
  },
});
