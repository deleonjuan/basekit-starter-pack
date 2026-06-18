import { Button } from "#/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import Setting from "./components/Setting";

export default function SystemSettings() {
  return (
    <>
      <Setting title="Tema">
        <div className="flex gap-2">
          <Button variant={"default"} disabled>
            Claro <SunIcon />
          </Button>
          <Button variant={"outline"} disabled>
            Oscuro <MoonIcon />
          </Button>
        </div>
      </Setting>
    </>
  );
}
