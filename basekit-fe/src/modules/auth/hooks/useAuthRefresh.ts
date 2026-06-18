import { useCallback, useEffect, useRef } from "react";
import { useRefreshToken } from "../queries/refreshToken.mutation";

const REFRESH_INTERVAL_MS = 12 * 60 * 1000;

interface UseAuthRefreshOptions {
  user: { id: string } | null | undefined;
  refetch: () => Promise<unknown>;
  onFailure: () => void;
}

export function useAuthRefresh({
  user,
  refetch,
  onFailure,
}: UseAuthRefreshOptions) {
  const [doRefreshToken] = useRefreshToken();
  const isRefreshingRef = useRef(false);
  const lastRefreshedRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performRefresh = useCallback(async (): Promise<boolean> => {
    if (isRefreshingRef.current) return true;
    isRefreshingRef.current = true;
    try {
      await doRefreshToken();
      await refetch();
      lastRefreshedRef.current = Date.now();
      return true;
    } catch {
      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [doRefreshToken, refetch]);

  // Proactive interval: refresh before the 15-minute access token expires
  useEffect(() => {
    if (!user) return;

    intervalRef.current = setInterval(async () => {
      const ok = await performRefresh();
      if (!ok) onFailure();
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.id, performRefresh, onFailure]);

  // Refresh when the tab becomes visible after a long absence
  useEffect(() => {
    if (!user) return;

    const handleVisibility = async () => {
      if (document.visibilityState !== "visible") return;
      if (Date.now() - lastRefreshedRef.current < REFRESH_INTERVAL_MS) return;
      const ok = await performRefresh();
      if (!ok) onFailure();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [user?.id, performRefresh, onFailure]);

  return { performRefresh };
}
