import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { useFieldContext } from "#/lib/form-generator/utils";
import { AppDialog } from "#/components/common";
import { useCreateRole } from "../queries/createRole.mutation";

function TextareaField() {
  const { t } = useTranslation();
  const f = useFieldContext<string>();
  return (
    <Textarea
      id={f.name}
      placeholder={t("roles.createDialog.descriptionPlaceholder")}
      value={f.state.value ?? ""}
      onChange={(e) => f.handleChange(e.target.value)}
      onBlur={f.handleBlur}
    />
  );
}

export function CreateRoleDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [createRole, { loading, error }] = useCreateRole();

  const formSchema: FormSchemaField[] = [
    {
      fields: [
        field.textField({
          name: "name",
          label: t("roles.createDialog.nameLabel"),
          placeholder: t("roles.createDialog.namePlaceholder"),
        }),
        field.customField({
          name: "description",
          label: t("roles.createDialog.descriptionLabel"),
          fieldComponent: TextareaField,
        }),
      ],
    },
  ];

  const form = useAppForm({
    defaultValues: { name: "", description: "" },
    onSubmit: async ({ value }) => {
      await createRole({
        variables: {
          input: {
            name: value.name,
            description: value.description || undefined,
          },
        },
      });
      form.reset();
      setOpen(false);
    },
  });

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={<Button />}
      triggerLabel={t("roles.createDialog.trigger")}
      title={t("roles.createDialog.title")}
      formId="create-role-form"
      onSubmitLabel={
        loading
          ? t("roles.createDialog.creating")
          : t("roles.createDialog.create")
      }
      disable={loading}
    >
      <form
        id="create-role-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppForm>
          <FormGenerator form={form} formSchema={formSchema} isModal />
        </form.AppForm>
        {error && (
          <p className="mt-2 text-sm text-destructive">
            {error.message ?? t("roles.createDialog.error")}
          </p>
        )}
      </form>
    </AppDialog>
  );
}
