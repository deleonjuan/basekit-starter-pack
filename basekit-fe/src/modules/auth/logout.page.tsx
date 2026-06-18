import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useApolloClient } from "@apollo/client/react";
import { useLogout } from "./queries/logout.mutation";

export function LogoutPage() {
  const [logout] = useLogout();
  const navigate = useNavigate();
  const client = useApolloClient();

  useEffect(() => {
    logout()
      .catch(() => {})
      .finally(async () => {
        await client.clearStore();
        navigate({ to: "/login" });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
