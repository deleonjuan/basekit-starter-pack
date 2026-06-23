import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { AppDialog, ItemFinder } from "#/components/common";
import { useGetRoles } from "#/modules/roles/queries/roles.query";
import type { Role } from "#/modules/roles/queries/roles.query";
import { useAssignRole } from "../queries/assignRole.mutation";
import type { UserRole } from "../queries/getUser.query";

interface AssignRoleDialogProps {
  userId: string;
  assignedRoles: UserRole[];
}

export function AssignRoleDialog({
  userId,
  assignedRoles,
}: AssignRoleDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [assignRole, { loading, error }] = useAssignRole();

  const assignedIds = new Set(assignedRoles.map((r) => r.id));

  const handleAccept = async () => {
    if (!selectedRole) return;
    await assignRole({
      variables: { userId, roleId: selectedRole.id },
      onCompleted: () => {
        setOpen(false);
        setSelectedRole(null);
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) setSelectedRole(null);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<Button variant="outline" />}
      triggerLabel={t("users.assignRoleDialog.trigger")}
      title={t("users.assignRoleDialog.title")}
      onSubmit={handleAccept}
      onSubmitLabel={
        loading
          ? t("users.assignRoleDialog.submitting")
          : t("users.assignRoleDialog.submit")
      }
      disable={!selectedRole || loading}
    >
      <ItemFinder<Role>
        useHook={useGetRoles}
        dataKey="roles"
        onChange={setSelectedRole}
        filter={(role) => !assignedIds.has(role.id)}
        placeholder={t("users.assignRoleDialog.searchPlaceholder")}
        noResultLabel={t("users.assignRoleDialog.noResults")}
      />
      {error && (
        <p className="mt-2 text-sm text-destructive">
          {error.message ?? t("users.assignRoleDialog.error")}
        </p>
      )}
    </AppDialog>
  );
}
