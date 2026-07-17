import type { ReactNode } from "react";

export interface DangerZoneAction {
  title: string;
  description: string;
  action: ReactNode;
}

interface DangerZoneTableProps {
  actions: DangerZoneAction[];
}

export default function DangerZoneTable({ actions }: DangerZoneTableProps) {
  return (
    <div className="border border-red-400 rounded-md divide-y divide-red-300 dark:divide-red-400">
      {actions.map((action, index) => (
        <div key={index} className="flex justify-between items-center p-4">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-bold">{action.title}</p>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>
          <div>{action.action}</div>
        </div>
      ))}
    </div>
  );
}
