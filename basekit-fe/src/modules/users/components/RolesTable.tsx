import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { SimpleDataTable } from "#/components/common/DataTable";
import { CustomDate, AppDialog } from "#/components/common";
import { Button } from "#/components/ui/button";
import { Trash2Icon } from "lucide-react";
import type { UserRole } from "../queries/getUser.query";
import { AssignRoleDialog } from "./AssignRoleDialog";
import { useRevokeRole } from "../queries/revokeRole.mutation";

function RevokeRoleButton({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [revokeRole, { loading }] = useRevokeRole();

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive"
        />
      }
      triggerLabel={<Trash2Icon size={16} />}
      title={t("users.rolesTable.revokeDialog.title")}
      onSubmit={async () => {
        await revokeRole({
          variables: { userId, roleId: role.id },
          onCompleted: () => setOpen(false),
        });
      }}
      onSubmitLabel={
        loading
          ? t("users.rolesTable.revokeDialog.submitting")
          : t("users.rolesTable.revokeDialog.submit")
      }
      disable={loading}
      showCloseButton={false}
      properties={{ submitButton: { variant: "destructive" } }}
    >
      <p className="text-sm text-muted-foreground">
        {t("users.rolesTable.revokeDialog.confirmPrefix")}{" "}
        <span className="font-medium text-foreground">{role.name}</span>{" "}
        {t("users.rolesTable.revokeDialog.confirmSuffix")}
      </p>
    </AppDialog>
  );
}

interface RolesTableProps {
  userId: string;
  roles: UserRole[];
  loading?: boolean;
}

export default function RolesTable({
  userId,
  roles,
  loading,
}: RolesTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<UserRole>[] = [
    { accessorKey: "name", header: t("users.rolesTable.columnName") },
    {
      accessorKey: "description",
      header: t("users.rolesTable.columnDescription"),
      cell: ({ getValue }) => getValue<string | null>() ?? "—",
    },
    {
      accessorKey: "createdAt",
      header: t("users.rolesTable.columnAssigned"),
      cell: ({ getValue }) => <CustomDate value={getValue<string>()} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <RevokeRoleButton userId={userId} role={row.original} />
        </div>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t("users.rolesTable.title")}</h2>
        <AssignRoleDialog userId={userId} assignedRoles={roles} />
      </div>
      <SimpleDataTable
        columns={columns}
        data={roles}
        isLoading={loading}
        hideHeaders={roles.length < 1}
        noInfoBanner={
          <div className="bg-muted flex justify-center py-4">
            {t("users.rolesTable.noRoles")}
          </div>
        }
      />
    </section>
  );
}
