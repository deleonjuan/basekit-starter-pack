import { useState } from "react";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useGetRole } from "./queries/getRole.query";
import { useUpdateRole } from "./queries/updateRole.mutation";
import { PermissionsTable } from "./components/PermissionsTable";
import { CustomDate } from "#/components/common";

const getFormSchema = (isEditing: boolean): FormSchemaField[] => [
  {
    title: "Nombre",
    fields: [
      field.textField({
        name: "name",
        type: "text",
        placeholder: "nombre-del-rol",
        disabled: !isEditing,
      }),
    ],
  },
  {
    title: "Description",
    fields: [
      field.textField({
        name: "description",
        type: "text",
        placeholder: "Descripción del rol",
        disabled: !isEditing,
      }),
    ],
  },
];

interface RoleDetailFormProps {
  roleId: string;
  name: string;
  description: string | null;
  createdAt: string;
}

function RoleDetailForm({
  roleId,
  name,
  description,
  createdAt,
}: RoleDetailFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [updateRole, { loading, error }] = useUpdateRole();

  const form = useAppForm({
    defaultValues: {
      name,
      description: description ?? "",
      createdAt: new Date(createdAt).toLocaleDateString(),
    },
    onSubmit: async ({ value }) => {
      await updateRole({
        variables: {
          id: roleId,
          input: {
            name: value.name,
            description: value.description || undefined,
          },
        },
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
      className="flex flex-col"
    >
      <section className="flex flex-col gap-4 pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Rol</h2>
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
            {error.message ?? "Error al actualizar el rol."}
          </p>
        )}
      </section>
    </form>
  );
}

interface RoleDetailContainerProps {
  roleId: string;
  role: NonNullable<ReturnType<typeof useGetRole>["role"]>;
  refetch: () => void;
  page: number;
}

function RoleDetailContainer({
  roleId,
  role,
  refetch,
  page,
}: RoleDetailContainerProps) {
  return (
    <AppPage
      title={role.name}
      subtitle={
        <>
          Creado: <CustomDate value={role.createdAt} />
        </>
      }
      goBackLink={{ to: "/admin/roles", label: "Roles" }}
    >
      <div className="mt-8 flex flex-col gap-10">
        <RoleDetailForm
          roleId={roleId}
          name={role.name}
          description={role.description}
          createdAt={role.createdAt}
        />

        <PermissionsTable
          roleId={roleId}
          assignedPermissions={role.permissions}
          refetch={refetch}
          page={page}
        />
      </div>
    </AppPage>
  );
}

interface RoleDetailPageProps {
  roleId: string;
  page: number;
}

export function RoleDetailPage({ roleId, page }: RoleDetailPageProps) {
  const { role, loading, refetch } = useGetRole(roleId);

  if (loading) {
    return (
      <AppPage
        title="Detalle de Rol"
        goBackLink={{ to: "/admin/roles", label: "Roles" }}
      >
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Cargando...</p>
        </div>
      </AppPage>
    );
  }

  if (!role) {
    return (
      <AppPage
        title="Detalle de Rol"
        goBackLink={{ to: "/admin/roles", label: "Roles" }}
      >
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">Rol no encontrado.</p>
        </div>
      </AppPage>
    );
  }

  return (
    <RoleDetailContainer
      roleId={roleId}
      role={role}
      refetch={refetch}
      page={page}
    />
  );
}
