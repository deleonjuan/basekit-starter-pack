import { createFormHook } from "@tanstack/react-form";
import { TextField, ValidationError } from "./fields";
import { fieldContext, formContext } from "./utils";

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    ValidationError,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
