import type { BasicFieldProps } from "../field";
import { useFieldContext } from "../utils";
import {
  NumberField as NumberFieldRoot,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "#/components/ui/number-field";

export type NumberFieldProps = BasicFieldProps<number> & {
  min?: number;
  max?: number;
  step?: number;
};

export const numberField = (props: NumberFieldProps) => ({
  fieldType: "NumberField",
  ...props,
});

export const NumberField = ({ min, max, step, disabled }: NumberFieldProps) => {
  const field = useFieldContext<number>();

  return (
    <NumberFieldRoot
      id={field.name}
      value={field.state.value ?? 0}
      onValueChange={(val) => field.handleChange(val ?? 0)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-invalid={field.state.meta.errors.length > 0}
    >
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput onBlur={field.handleBlur} />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldRoot>
  );
};
