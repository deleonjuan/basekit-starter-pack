import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { ShieldOffIcon } from "lucide-react";

export function ForbiddenScreen() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-2">
        <ShieldOffIcon
          size={48}
          className="text-muted-foreground"
          strokeWidth={1.5}
        />
        <h1 className="text-6xl font-bold tracking-tight">403</h1>
        <p className="text-xl font-medium">{t("screens.forbidden.heading")}</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          {t("screens.forbidden.description")}
        </p>
      </div>
      <Link to="/admin">
        <Button>{t("screens.forbidden.backButton")}</Button>
      </Link>
    </div>
  );
}
