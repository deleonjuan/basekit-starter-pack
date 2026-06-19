import { Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { SearchXIcon } from "lucide-react";

export function NotFoundScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-2">
        <SearchXIcon
          size={48}
          className="text-muted-foreground"
          strokeWidth={1.5}
        />
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-xl font-medium">Página no encontrada</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          La página que estás buscando no existe o fue movida.
        </p>
      </div>
      <Link to="/admin">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
