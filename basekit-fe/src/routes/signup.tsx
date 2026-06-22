import { createFileRoute } from "@tanstack/react-router";
import { SignupPage } from "#/modules/auth/signup.page";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});
