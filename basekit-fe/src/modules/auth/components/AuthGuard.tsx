import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetCurrentUser } from "../queries/getCurrentUser.query";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data, loading, error } = useGetCurrentUser();
  const navigate = useNavigate();

  const user = data?.me;

  useEffect(() => {
    if (loading) return;

    if (!user || error) {
      navigate({ to: "/login" });
      return;
    }
  }, [loading, user, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user || error) return null;

  return <>{children}</>;
}
