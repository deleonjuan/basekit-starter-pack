import { Input } from "#/components/ui/input";
import type { BasicFieldProps } from "../field";
import { useFieldContext } from "../utils";

export type TextFieldProps = BasicFieldProps<string> & {
  placeholder?: string;
  type?: "text" | "email" | "password" | "url" | "tel" | "search";
};

export const textField = (props: TextFieldProps) => ({
  fieldType: "TextField",
  ...props,
});

export const TextField = ({
  placeholder,
  type = "text",
  disabled,
}: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <Input
      id={field.name}
      type={type}
      placeholder={placeholder}
      value={field.state.value ?? ""}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      disabled={disabled}
      aria-invalid={field.state.meta.errors.length > 0}
      className="disabled:opacity-100! disabled:border-transparent disabled:shadow-none"
    />
  );
};
