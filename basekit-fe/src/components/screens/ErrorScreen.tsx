import { Link } from "@tanstack/react-router";
import { useApolloClient } from "@apollo/client/react";
import { Button } from "#/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import type { ErrorComponentProps } from "@tanstack/react-router";

export function ErrorScreen({ error, reset }: ErrorComponentProps) {
  const client = useApolloClient();

  const handleReset = async () => {
    try {
      await client.clearStore();
    } catch {
      // proceed even if cache clear fails
    }
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex flex-col items-center gap-2">
        <AlertTriangleIcon
          size={48}
          className="text-destructive"
          strokeWidth={1.5}
        />
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error.message || "Ocurrió un error inesperado."}
        </p>
        {import.meta.env.DEV && error.stack && (
          <pre className="mt-2 max-w-xl overflow-auto rounded-lg bg-muted p-4 text-left text-xs text-muted-foreground">
            {error.stack}
          </pre>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={handleReset}>Reintentar</Button>
        <Link to="/admin">
          <Button variant="outline">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
