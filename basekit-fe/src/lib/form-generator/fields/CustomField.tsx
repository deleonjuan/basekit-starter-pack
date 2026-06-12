import type { BasicFieldProps } from "../field";

type CustomFieldProps<T> = BasicFieldProps<T> & {
  /* eslint-disable-next-line */
  fieldComponent: any;
};
export const customField = (props: CustomFieldProps<unknown>) => ({
  fieldType: "CustomField",
  ...props,
});
