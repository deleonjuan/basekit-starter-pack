import { AppPage } from "#/lib/universal-layout/";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Image } from "#/components/common";
import banner from "#/assets/banner.png";
import { Users, Key } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboard,
});

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-muted/30 p-8 md:p-12">
      <div className="flex flex-col gap-8 max-w-2xl">
        <Image src={banner} alt="BaseKit" size="220px" />
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Panel de administración
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Gestiona usuarios, roles y permisos de tu aplicación desde un solo
            lugar.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/users" search={{ page: 1 }}>
            <Button className="gap-2">
              <Users size={16} />
              Gestionar Usuarios
            </Button>
          </Link>
          <Link to="/admin/roles" search={{ page: 1 }}>
            <Button variant="outline" className="gap-2">
              <Key size={16} />
              Gestionar Roles
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  return (
    <AppPage>
      <div className="py-8">
        <HeroSection />
      </div>
    </AppPage>
  );
}
