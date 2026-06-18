import { createFileRoute } from "@tanstack/react-router";
import { RoleDetailPage } from "#/modules/roles/roleDetail.page";

export const Route = createFileRoute("/_admin/admin/roles/$roleId")({
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 1),
  }),
  component: function RoleDetailRoute() {
    const { roleId } = Route.useParams();
    const { page } = Route.useSearch();
    return <RoleDetailPage roleId={roleId} page={page} />;
  },
});
