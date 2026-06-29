import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import { Button } from "#/components/ui/button";
import { Image } from "#/components/common";
import { Users, Key } from "lucide-react";
import logo from "#/assets/logo192.png";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl border p-8 md:p-12 bg-gradient-to-tl from-sky-800 via-sky-400 to-sky-200 dark:from-sky-800 dark:via-blue-400 dark:to-blue-300">
      <div className="flex flex-col gap-8 max-w-2xl">
        <Image src={logo} alt="BaseKit" size={150} />
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {t("dashboard.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-white">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" search={{ page: 1, search: "" }}>
            <Button className="gap-2">
              <Users size={16} />
              {t("dashboard.manageUsers")}
            </Button>
          </Link>
          <Link to="/admin/roles" search={{ page: 1, search: "" }}>
            <Button variant="outline" className="gap-2">
              <Key size={16} />
              {t("dashboard.manageRoles")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  return (
    <AppPage>
      <div className="py-8">
        <HeroSection />
      </div>
    </AppPage>
  );
}
