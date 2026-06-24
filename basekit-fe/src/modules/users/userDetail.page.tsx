import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import { FormGenerator, useAppForm, field } from "#/lib/form-generator";
import type { FormSchemaField } from "#/lib/form-generator";
import { Button } from "#/components/ui/button";
import { AppDialog, withPermissions, Permissions } from "#/components/common";
import { useGetUser } from "./queries/getUser.query";
import type { GetUserData } from "./queries/getUser.query";
import { useUpdateUser } from "./queries/updateUser.mutation";
import { PencilIcon, UserRoundXIcon } from "lucide-react";
import type { User } from "./queries/users.query";
import RolesTable from "./components/RolesTable";
import { PERMISSIONS } from "#/lib/permissions";
import { useParams } from "@tanstack/react-router";

function UserDetailForm({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { loading, error }] = useUpdateUser();

  const getFormSchema = (): FormSchemaField[] => [
    {
      title: t("users.detail.sectionTitle"),
      fields: [
        field.textField({
          name: "username",
          type: "text",
          placeholder: t("users.detail.usernamePlaceholder"),
          disabled: !isEditing,
        }),
      ],
    },
  ];

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
          <h2 className="text-lg font-semibold">
            {t("users.detail.sectionTitle")}
          </h2>
          {!isEditing ? (
            <Permissions required={[PERMISSIONS.USERS.WRITE]}>
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
            {error.message ?? t("users.detail.updateError")}
          </p>
        )}
      </section>
    </form>
  );
}

function DangerZone({ userId, user }: { userId: string; user: User | null }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [updateUser, { loading }] = useUpdateUser();
  const isActive = user?.isActive;

  const labels = isActive
    ? {
        sectionTitle: t("users.detail.dangerZone.deactivate.sectionTitle"),
        description: t("users.detail.dangerZone.deactivate.description"),
        triggerLabel: t("users.detail.dangerZone.deactivate.triggerLabel"),
        dialogTitle: t("users.detail.dangerZone.deactivate.dialogTitle"),
        submitLabel: loading
          ? t("users.detail.dangerZone.deactivate.submitting")
          : t("users.detail.dangerZone.deactivate.submit"),
      }
    : {
        sectionTitle: t("users.detail.dangerZone.activate.sectionTitle"),
        description: t("users.detail.dangerZone.activate.description"),
        triggerLabel: t("users.detail.dangerZone.activate.triggerLabel"),
        dialogTitle: t("users.detail.dangerZone.activate.dialogTitle"),
        submitLabel: loading
          ? t("users.detail.dangerZone.activate.submitting")
          : t("users.detail.dangerZone.activate.submit"),
      };

  const handleConfirm = () => {
    updateUser({
      variables: { id: userId, input: { isActive: !isActive } },
      onCompleted: () => setOpen(false),
    });
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        {t("users.detail.dangerZone.title")}
      </h2>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">{labels.sectionTitle}</p>
        <p className="text-sm text-muted-foreground">{labels.description}</p>
        <div className="mt-3">
          <AppDialog
            isAlert
            open={open}
            onOpenChange={setOpen}
            trigger={
              <Button
                variant={isActive ? "destructive" : "default"}
                disabled={loading}
              />
            }
            icon={<UserRoundXIcon />}
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
    <div className="mt-8 flex flex-col gap-10">
      <UserDetailForm userId={userId} username={user?.username ?? ""} />
      <RolesTable userId={userId} roles={user?.roles ?? []} />
      <Permissions required={[PERMISSIONS.USERS.WRITE]}>
        <DangerZone userId={userId} user={user} />
      </Permissions>
    </div>
  );
}

export const UserDetailPage = withPermissions(() => {
  const { userId } = useParams({ from: "/_admin/admin/users/$userId" });
  const { t } = useTranslation();
  const { user, loading } = useGetUser(userId);

  return (
    <AppPage
      title={t("users.detail.title")}
      goBackLink={{
        to: "/admin/users",
        label: t("users.detail.backLabel"),
      }}
    >
      {loading ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        </div>
      ) : (
        <UserDetailContainer userId={userId} user={user} />
      )}
    </AppPage>
  );
}, [PERMISSIONS.USERS.READ]);
