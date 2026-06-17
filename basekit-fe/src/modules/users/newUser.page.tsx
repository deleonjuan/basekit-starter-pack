import { useNavigate } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useCreateUser } from "./queries/createUser.mutation";

const formSchema: FormSchemaField[] = [
  {
    title: "Nombre de usuario",
    fields: [
      field.textField({
        name: "username",
        type: "text",
        placeholder: "nombre-usuario",
      }),
    ],
  },
  {
    title: "Contraseña",
    fields: [
      field.textField({
        name: "password",
        type: "password",
        placeholder: "••••••••",
      }),
    ],
  },
];

export function NewUserPage() {
  const navigate = useNavigate();
  const [createUser, { loading, error }] = useCreateUser();

  const form = useAppForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      await createUser({
        variables: { input: value },
        onCompleted: () => navigate({ to: "/admin/users" }),
      });
    },
  });

  return (
    <AppPage
      title="Nuevo Usuario"
      goBackLink={{ to: "/admin/users", label: "Usuarios" }}
    >
      <div className="mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <FormGenerator form={form} formSchema={formSchema} />

          {error && (
            <p className="text-sm text-red-500">
              {error.message ?? "Error al crear el usuario."}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </div>
    </AppPage>
  );
}
