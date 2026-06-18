import { useState } from "react";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { AppDialog } from "#/components/common";
import { useGetUser } from "./queries/getUser.query";
import type { GetUserData } from "./queries/getUser.query";
import { useUpdateUser } from "./queries/updateUser.mutation";
import { PencilIcon } from "lucide-react";
import type { User } from "./queries/users.query";
import RolesTable from "./components/RolesTable";

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
      <section className="flex flex-col gap-4 pb-6">
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

        <div className="xl:w-1/2 w-full">
          <FormGenerator form={form} formSchema={getFormSchema(isEditing)} />
        </div>

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
  const [open, setOpen] = useState(false);
  const [updateUser, { loading }] = useUpdateUser();
  const isActive = user?.isActive;

  const labels = isActive
    ? {
        sectionTitle: "Desactivar usuario",
        description:
          "Una vez desactivado, este usuario no podrá iniciar sesión o ejecutar ninguna operación.",
        triggerLabel: "Desactivar este usuario",
        dialogTitle: "¿Desactivar usuario?",
        submitLabel: loading ? "Desactivando..." : "Desactivar",
      }
    : {
        sectionTitle: "Activar usuario",
        description:
          "Una vez activado, este usuario podrá iniciar sesión y ejecutar operaciones.",
        triggerLabel: "Activar este usuario",
        dialogTitle: "¿Activar usuario?",
        submitLabel: loading ? "Activando..." : "Activar",
      };

  const handleConfirm = () => {
    updateUser({
      variables: { id: userId, input: { isActive: !isActive } },
      onCompleted: () => setOpen(false),
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Zona de peligro</h2>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{labels.sectionTitle}</p>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
        <div className="mt-3">
          <AppDialog
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button
                variant={isActive ? "destructive" : "default"}
                disabled={loading}
              />
            }
            triggerLabel={labels.triggerLabel}
            title={labels.dialogTitle}
            onSubmit={handleConfirm}
            onSubmitLabel={labels.submitLabel}
            disable={loading}
            showCloseButton={false}
            properties={
              isActive
                ? { submitButton: { variant: "destructive" } }
                : undefined
            }
          >
            <p className="text-sm text-muted-foreground">
              {labels.description}
            </p>
          </AppDialog>
        </div>
      </div>
    </section>
  );
}

function UserDetailContainer({
  userId,
  user,
}: {
  userId: string;
  user: GetUserData["user"] | null;
}) {
  return (
    <AppPage
      title="Detalle de Usuario"
      goBackLink={{ to: "/admin/users", label: "Usuarios" }}
    >
      <div className="mt-8 flex flex-col gap-10">
        <UserDetailForm userId={userId} username={user?.username ?? ""} />
        <RolesTable userId={userId} roles={user?.roles ?? []} />
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
