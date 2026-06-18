import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

export type Tabs = {
  value: string;
  label: string;
};

interface SettingsTabsProps {
  tabs: Tabs[];
  className?: string;
  value: string;
  onValueChange: (value: string) => void;
}

export default function SettingsTabs({
  tabs,
  className,
  value,
  onValueChange,
}: SettingsTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <div className="border-b">
        <TabsList variant="underline" className="gap-4">
          {tabs.map((tab) => (
            <TabsTab
              key={tab.value}
              className="hover:bg-background! px-0"
              value={tab.value}
            >
              {tab.label}
            </TabsTab>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
}
