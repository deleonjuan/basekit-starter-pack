import { UsersPage } from "#/modules/users/users.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin/admin/users/")({
  component: UsersPage,
});
