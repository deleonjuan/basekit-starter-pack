import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
} from "#/components/ui/dialog";
import { Textarea } from "#/components/ui/textarea";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { useFieldContext } from "#/lib/form-generator/utils";
import { useCreateRole } from "../queries/createRole.mutation";

const TextareaField = () => {
  const f = useFieldContext<string>();
  return (
    <Textarea
      id={f.name}
      placeholder="Descripción del rol"
      value={f.state.value ?? ""}
      onChange={(e) => f.handleChange(e.target.value)}
      onBlur={f.handleBlur}
    />
  );
};

const formSchema: FormSchemaField[] = [
  {
    fields: [
      field.textField({
        name: "name",
        label: "Nombre",
        placeholder: "Nombre del rol",
      }),
      field.customField({
        name: "description",
        label: "Descripción",
        fieldComponent: TextareaField,
      }),
    ],
  },
];

export function CreateRoleDialog() {
  const [open, setOpen] = useState(false);
  const [createRole, { loading, error }] = useCreateRole();

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Nuevo</DialogTrigger>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>Nuevo rol</DialogTitle>
        </DialogHeader>
        <DialogPanel>
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
                {error.message ?? "Error al crear el rol."}
              </p>
            )}
          </form>
        </DialogPanel>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancelar
          </Button>
          <Button form="create-role-form" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
