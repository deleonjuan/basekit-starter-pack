import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { PencilIcon } from "lucide-react";
import { useGetRole } from "./queries/getRole.query";
import { useUpdateRole } from "./queries/updateRole.mutation";
import { PermissionsTable } from "./components/PermissionsTable";
import { CustomDate, withPermissions, Permissions } from "#/components/common";
import { PERMISSIONS } from "#/lib/permissions";

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
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [updateRole, { loading, error }] = useUpdateRole();

  const getFormSchema = (): FormSchemaField[] => [
    {
      title: t("roles.detail.nameTitle"),
      fields: [
        field.textField({
          name: "name",
          type: "text",
          placeholder: t("roles.detail.namePlaceholder"),
          disabled: !isEditing,
        }),
      ],
    },
    {
      title: t("roles.detail.descriptionTitle"),
      fields: [
        field.textField({
          name: "description",
          type: "text",
          placeholder: t("roles.detail.descriptionPlaceholder"),
          disabled: !isEditing,
        }),
      ],
    },
  ];

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
          <h2 className="text-lg font-semibold">
            {t("roles.detail.sectionTitle")}
          </h2>
          {!isEditing ? (
            <Permissions required={[PERMISSIONS.ROLES.WRITE]}>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <PencilIcon size={16} />
                {t("common.edit")}
              </Button>
            </Permissions>
          ) : (
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? t("common.saving") : t("common.save")}
              </Button>
            </div>
          )}
        </div>
        <div className="xl:w-1/2 w-full">
          <FormGenerator form={form} formSchema={getFormSchema()} />
        </div>
        {error && (
          <p className="text-sm text-red-500">
            {error.message ?? t("roles.detail.updateError")}
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
  const { t } = useTranslation();
  return (
    <AppPage
      title={role.name}
      subtitle={
        <>
          {t("roles.detail.createdLabel")} <CustomDate value={role.createdAt} />
        </>
      }
      goBackLink={{ to: "/admin/roles", label: t("roles.detail.backLabel") }}
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

export const RoleDetailPage = withPermissions(
  function RoleDetailPage({ roleId, page }: RoleDetailPageProps) {
    const { t } = useTranslation();
    const { role, loading, refetch } = useGetRole(roleId);

    if (loading) {
      return (
        <AppPage
          title={t("roles.detail.title")}
          goBackLink={{
            to: "/admin/roles",
            label: t("roles.detail.backLabel"),
          }}
        >
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              {t("common.loading")}
            </p>
          </div>
        </AppPage>
      );
    }

    if (!role) {
      return (
        <AppPage
          title={t("roles.detail.title")}
          goBackLink={{
            to: "/admin/roles",
            label: t("roles.detail.backLabel"),
          }}
        >
          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              {t("roles.detail.notFound")}
            </p>
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
  },
  [PERMISSIONS.ROLES.READ],
);
