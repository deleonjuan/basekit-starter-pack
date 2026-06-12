import { cva } from "class-variance-authority";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useForm } from "@tanstack/react-form";

import type { BasicFieldProps, FormSchemaField } from "./field";
import type { ReactNode } from "react";

type formVariant = "full" | "simple";

const FieldInput = ({ field, fieldInput, form }: any) => {
  let FieldComponent;

  if (fieldInput.fieldType === "CustomField") {
    FieldComponent = fieldInput.fieldComponent;
  } else {
    FieldComponent = field[fieldInput.fieldType];
  }

  return <FieldComponent field={field} {...fieldInput} form={form} />;
};

const fieldVariants = cva("", {
  variants: {
    variant: {
      full: [],
      simple: ["flex", "flex-row", "items-start", "gap-x-4"],
    },
  },
  defaultVariants: {
    variant: "full",
  },
});

const FormFieldContainer = ({
  fieldInput,
  form,
  variant,
  isModal,
}: {
  fieldInput: BasicFieldProps<string | number | boolean>;
  form: any;
  variant: formVariant;
  isModal?: boolean;
}) => {
  const { state } = useForm();

  if (
    fieldInput.visible !== undefined &&
    !fieldInput.visible(state.values as any)
  ) {
    return null;
  }

  const labelStyle = variant === "simple" ? "w-2/5 justify-end mt-1" : "";

  return (
    <form.AppField
      key={fieldInput.name}
      name={fieldInput.name}
      listeners={fieldInput.listeners}
      validators={fieldInput.validators}
      children={(field: any) => (
        <Field className={fieldVariants({ variant })}>
          <FieldLabel
            className={`mb-1 ${labelStyle} ${isModal ? "w-2/4!" : ""}`}
            htmlFor={field.name}
          >
            {fieldInput.label}
          </FieldLabel>
          <div className="w-full">
            <FieldInput field={field} fieldInput={fieldInput} form={form} />
            <field.ValidationError />
          </div>
        </Field>
      )}
    />
  );
};

type FormSectionProps = {
  title: string | undefined;
  description?: string;
  infoComponent?: ReactNode;
  fields?: any[];
  form: any;
  isModal?: boolean;
  isLast: boolean;
  isFirst: boolean;
  formVariant: formVariant;
  visible?: (fields: Record<string, any>) => boolean;
};

export const FormSection = ({
  title = undefined,
  description,
  infoComponent,
  fields,
  form,
  isModal = false,
  isLast,
  isFirst,
  formVariant,
  visible,
}: FormSectionProps) => {
  const { state } = useForm();

  if (visible !== undefined && !visible(state.values as any)) {
    return null;
  }

  return (
    <FieldGroup
      className={`flex flex-col py-5
        ${!isModal ? "lg:flex-row" : ""}
        ${!isLast ? "border-b" : ""}
        ${isFirst ? "pt-0" : ""}
        `}
    >
      {title && (
        <div
          className={`flex flex-col w-full pe-8 ${!isModal ? "lg:w-2/4" : ""}`}
        >
          <FieldLegend className="font-medium">{title}</FieldLegend>
          <FieldDescription className="text-muted-foreground text-sm">
            {description}
          </FieldDescription>
          {infoComponent}
        </div>
      )}
      <div className={`w-full flex flex-col gap-8 mt-1`}>
        {fields?.map((field) => (
          <FormFieldContainer
            key={field.name}
            fieldInput={field}
            form={form}
            variant={formVariant}
            isModal={isModal}
          />
        ))}
      </div>
    </FieldGroup>
  );
};

interface FormGeneratorProps {
  form: any;
  formSchema: FormSchemaField[];
  isModal?: boolean;
  formVariant?: formVariant;
}

export const FormGenerator = ({
  form,
  formSchema,
  isModal,
  formVariant = "full",
}: FormGeneratorProps) => {
  return (
    <FieldSet className="h-full" key="field-set">
      {formSchema.map((section, key: number) => (
        <FormSection
          key={key}
          title={section.title}
          description={section.description}
          infoComponent={section.infoComponent}
          visible={section.visible}
          fields={section.fields}
          form={form}
          isModal={isModal}
          isLast={key + 1 === formSchema.length}
          isFirst={key === 0}
          formVariant={formVariant}
        />
      ))}
    </FieldSet>
  );
};
