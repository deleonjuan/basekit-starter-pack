import { createFileRoute } from "@tanstack/react-router";
import { RolesPage } from "#/modules/roles/roles.page";

export const Route = createFileRoute("/_admin/admin/roles/")({
  component: RolesPage,
});
