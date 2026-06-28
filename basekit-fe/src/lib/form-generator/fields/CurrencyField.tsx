import type { BasicFieldProps } from "../field";
import { useFieldContext } from "../utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "#/components/ui/input-group";
import {
  NumberField as NumberFieldRoot,
  NumberFieldInput,
} from "#/components/ui/number-field";

function getCurrencySymbol(currency: string): string {
  try {
    return (
      new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        currencyDisplay: "narrowSymbol",
      })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value ?? currency
    );
  } catch {
    return currency;
  }
}

export type CurrencyFieldProps = BasicFieldProps<number> & {
  currency?: string;
  min?: number;
  max?: number;
  step?: number;
};

export const currencyField = (props: CurrencyFieldProps) => ({
  fieldType: "CurrencyField",
  ...props,
});

export const CurrencyField = ({
  currency = "USD",
  min = 0,
  max,
  step = 0.01,
  disabled,
}: CurrencyFieldProps) => {
  const field = useFieldContext<number>();
  const symbol = getCurrencySymbol(currency);

  return (
    <InputGroup>
      <NumberFieldRoot
        id={field.name}
        value={field.state.value ?? 0}
        onValueChange={(val) => field.handleChange(val ?? 0)}
        format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={field.state.meta.errors.length > 0}
      >
        <NumberFieldInput onBlur={field.handleBlur} className="text-left" />
      </NumberFieldRoot>
      <InputGroupAddon>
        <InputGroupText>{symbol}</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupText>{currency}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
};
