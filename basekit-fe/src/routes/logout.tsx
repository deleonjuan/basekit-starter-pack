import { createFileRoute } from "@tanstack/react-router";
import { LogoutPage } from "#/modules/auth/logout.page";

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
});
