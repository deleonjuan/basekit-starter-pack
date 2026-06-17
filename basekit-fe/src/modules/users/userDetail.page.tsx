import { useState } from "react";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { useGetUser } from "./queries/getUser.query";
import { useUpdateUser } from "./queries/updateUser.mutation";
import { PencilIcon } from "lucide-react";
import type { User } from "./queries/users.query";

const getFormSchema = (isEditing: boolean): FormSchemaField[] => [
  {
    title: "Nombre de usuario",
    fields: [
      field.textField({
        name: "username",
        type: "text",
        placeholder: "nombre-usuario",
        disabled: !isEditing,
      }),
    ],
  },
];

function UserDetailForm({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { loading, error }] = useUpdateUser();

  const form = useAppForm({
    defaultValues: { username },
    onSubmit: async ({ value }) => {
      await updateUser({
        variables: { id: userId, input: { username: value.username } },
        onCompleted: () => setIsEditing(false),
      });
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <section className="flex flex-col gap-4 border-b pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Usuario</h2>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <PencilIcon size={16} />
              Editar
            </Button>
          ) : (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          )}
        </div>

        <FormGenerator form={form} formSchema={getFormSchema(isEditing)} />

        {error && (
          <p className="text-sm text-red-500">
            {error.message ?? "Error al actualizar el usuario."}
          </p>
        )}
      </section>
    </form>
  );
}

function DangerZone({ userId, user }: { userId: string; user: User | null }) {
  const [updateUser, { loading }] = useUpdateUser();
  const isActive = user?.isActive;

  const labelOptions = {
    active: {
      title: "Desactivar usuario",
      description:
        "Una vez desactivado, este usuario no podra iniciar sesion o ejecutar ninguna operacion",
      deactivateButton: "Desactivar este usuario",
    },
    inactive: {
      title: "Activar usuario",
      description:
        "Una vez activado, este usuario podra iniciar sesion y ejecutar operaciones",
      deactivateButton: "activar este usuario",
    },
  };
  const labels = labelOptions[isActive ? "active" : "inactive"];

  const formSchema: FormSchemaField[] = [
    {
      title: labels.title,
      description: labels.description,
      fields: [
        field.customField({
          name: "deactivate",
          fieldComponent: () => (
            <Button
              variant={isActive ? "destructive" : "default"}
              disabled={loading}
              onClick={() =>
                updateUser({
                  variables: { id: userId, input: { isActive: !isActive } },
                })
              }
            >
              {loading ? "Desactivando..." : labels.deactivateButton}
            </Button>
          ),
        }),
      ],
    },
  ];

  const form = useAppForm({});

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Zona de peligro</h2>
      <FormGenerator formSchema={formSchema} form={form} />
    </section>
  );
}

function UserDetailContainer({
  userId,
  user,
}: {
  userId: string;
  user: User | null;
}) {
  return (
    <AppPage
      title="Detalle de Usuario"
      goBackLink={{ to: "/admin/users", label: "Usuarios" }}
    >
      <div className="mt-8 flex flex-col gap-10">
        <UserDetailForm userId={userId} username={user?.username ?? ""} />
        <DangerZone userId={userId} user={user} />
      </div>
    </AppPage>
  );
}

interface UserDetailPageProps {
  userId: string;
}

export function UserDetailPage({ userId }: UserDetailPageProps) {
  const { user, loading } = useGetUser(userId);

  if (loading) {
    return (
      <AppPage
        title="Detalle de Usuario"
        goBackLink={{ to: "/admin/users", label: "Usuarios" }}
      >
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </AppPage>
    );
  }

  return <UserDetailContainer userId={userId} user={user} />;
}
