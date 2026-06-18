import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useGetCurrentUser } from "../queries/getCurrentUser.query";
import { useAuthRefresh } from "../hooks/useAuthRefresh";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data, loading, error, refetch } = useGetCurrentUser();
  const [refreshing, setRefreshing] = useState(false);
  const refreshAttemptedRef = useRef(false);
  const navigate = useNavigate();

  const user = data?.me;

  const redirectToLogin = useCallback(() => {
    navigate({ to: "/login" });
  }, [navigate]);

  const { performRefresh } = useAuthRefresh({
    user,
    refetch,
    onFailure: redirectToLogin,
  });

  // On auth error (e.g. expired access token on load): try refresh once before redirecting
  useEffect(() => {
    if (loading || refreshAttemptedRef.current || user) return;

    if (!error) {
      redirectToLogin();
      return;
    }

    refreshAttemptedRef.current = true;
    setRefreshing(true);
    performRefresh()
      .then((ok) => {
        if (!ok) redirectToLogin();
      })
      .finally(() => setRefreshing(false));
  }, [loading, user, error, performRefresh, redirectToLogin]);

  if (loading || refreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
