interface SettingProps {
  title: string;
  children: React.ReactNode;
}

export default function Setting({ title, children }: SettingProps) {
  return (
    <div className="flex flex-row">
      <div className="w-1/4">
        <span className="font-medium">{title}</span>
      </div>
      <div className="w-3/4">{children}</div>
    </div>
  );
}
