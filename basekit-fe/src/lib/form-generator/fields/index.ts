import { ValidationError } from "./ValidationError";
import { customField } from "./CustomField";
import { textField, TextField } from "./TextField";
import { switchField, SwitchField } from "./SwitchField";
import { numberField, NumberField } from "./NumberField";
import { currencyField, CurrencyField } from "./CurrencyField";

export { TextField, SwitchField, NumberField, CurrencyField, ValidationError };

export const field = {
  textField,
  switchField,
  numberField,
  currencyField,
  customField,
};
