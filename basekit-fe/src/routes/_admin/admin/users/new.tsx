import { createFileRoute } from "@tanstack/react-router";
import { NewUserPage } from "#/modules/users/newUser.page";

export const Route = createFileRoute("/_admin/admin/users/new")({
  component: NewUserPage,
});
