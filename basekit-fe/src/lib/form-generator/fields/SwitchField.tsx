import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import type { BasicFieldProps } from "../field";
import { useFieldContext } from "../utils";

export type SwitchFieldProps = BasicFieldProps<boolean> & {
  description?: string;
  title?: string;
};

export const switchField = (props: SwitchFieldProps) => ({
  fieldType: "SwitchField",
  ...props,
});

export const SwitchField = ({
  description,
  title,
  disabled,
}: SwitchFieldProps) => {
  const field = useFieldContext<boolean>();

  return (
    <Label
      className="flex items-center justify-between gap-6 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
      htmlFor={field.name}
    >
      <div className="flex flex-col gap-1">
        <p>{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch
        id={field.name}
        checked={field.state.value ?? false}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
        disabled={disabled}
        className="[--thumb-size:--spacing(4)] sm:[--thumb-size:--spacing(3)]"
      />
    </Label>
  );
};
