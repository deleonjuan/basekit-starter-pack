import { createFileRoute } from "@tanstack/react-router";
import { UserDetailPage } from "#/modules/users/userDetail.page";

export const Route = createFileRoute("/_admin/admin/users/$userId")({
  component: UserDetailPage,
});
