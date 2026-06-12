/** DEVELOPER NOTE:
 *  make sure the fieldType name matches the name provided in the useAppForm.ts file
 *  as the name is case sensitive
 */

export type BasicFieldProps<T> = {
  name: string;
  label?: string;
  listeners?: {
    onChange?: (t: { value: T }) => void;
  };
  validators?: {
    onChange?: (t: { value: T }) => void;
    onChangeAsyncDebounceMs?: number;
    onChangeAsync?: (t: { value: T }) => void;
  };
  visible?: (fields: Record<string, any>) => boolean;
  disabled?: boolean;
};

export type FormSchemaField = {
  title?: string;
  description?: string;
  infoComponent?: React.ReactNode;
  fields: Array<BasicFieldProps>;
  visible?: (fields: Record<string, any>) => boolean;
};
