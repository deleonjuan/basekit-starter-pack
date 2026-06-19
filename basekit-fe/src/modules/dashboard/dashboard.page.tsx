import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import { Button } from "#/components/ui/button";
import { Image } from "#/components/common";
import { Users, Key } from "lucide-react";
import banner from "#/assets/banner.png";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-muted/30 p-8 md:p-12">
      <div className="flex flex-col gap-8 max-w-2xl">
        <Image src={banner} alt="BaseKit" size="220px" />
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" search={{ page: 1 }}>
            <Button className="gap-2">
              <Users size={16} />
              {t("dashboard.manageUsers")}
            </Button>
          </Link>
          <Link to="/admin/roles" search={{ page: 1 }}>
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
