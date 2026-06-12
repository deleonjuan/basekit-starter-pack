import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetCurrentUser } from "../queries/getCurrentUser";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { data, loading, error } = useGetCurrentUser();
  const navigate = useNavigate();

  const user = data?.currentUser;

  useEffect(() => {
    if (loading) return;

    if (!user || error) {
      navigate({ to: "/login" });
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      navigate({ to: "/" });
    }
  }, [loading, user, error, requireAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user || error) return null;

  if (requireAdmin && user.role !== "admin") return null;

  return <>{children}</>;
}
