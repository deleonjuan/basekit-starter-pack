import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "radix-ui";
import { Check } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "#/components/common/DataTable";
import { Button } from "#/components/ui/button";
import { useGetPermissions } from "../queries/getPermissions.query";
import type { Permission } from "../queries/getPermissions.query";
import type { RolePermission } from "../queries/getRole.query";
import { useSyncPermissions } from "../queries/syncPermissions.mutation";

interface PermissionsTableProps {
  roleId: string;
  assignedPermissions: RolePermission[];
  refetch: () => void;
  page: number;
}

export function PermissionsTable({
  roleId,
  assignedPermissions,
  refetch,
  page,
}: PermissionsTableProps) {
  const { t } = useTranslation();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set(assignedPermissions.map((p) => p.id)),
  );
  const { data, loading } = useGetPermissions(page, 20);
  const [syncPermissions, { loading: saving }] = useSyncPermissions(roleId);

  useEffect(() => {
    setCheckedIds(new Set(assignedPermissions.map((p) => p.id)));
  }, [assignedPermissions]);

  const originalIds = new Set(assignedPermissions.map((p) => p.id));
  const isDirty =
    [...checkedIds].some((id) => !originalIds.has(id)) ||
    [...originalIds].some((id) => !checkedIds.has(id));

  const handleToggle = (permissionId: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(permissionId)
        ? next.delete(permissionId)
        : next.add(permissionId);
      return next;
    });
  };

  const handleSave = async () => {
    const assign = [...checkedIds].filter((id) => !originalIds.has(id));
    const revoke = [...originalIds].filter((id) => !checkedIds.has(id));
    await syncPermissions({ variables: { roleId, assign, revoke } });
    refetch();
  };

  const handleCancel = () => {
    setCheckedIds(new Set(assignedPermissions.map((p) => p.id)));
  };

  const columns: ColumnDef<Permission>[] = [
    {
      id: "assigned",
      header: "",
      size: 1,
      cell: ({ row }) => {
        const isChecked = checkedIds.has(row.original.id);
        return (
          <Checkbox.Root
            checked={isChecked}
            disabled={saving}
            onCheckedChange={() => handleToggle(row.original.id)}
            className="flex h-4 w-4 items-center justify-center rounded border border-input bg-background shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Checkbox.Indicator>
              <Check
                size={12}
                className="text-primary-foreground"
                strokeWidth={3}
              />
            </Checkbox.Indicator>
          </Checkbox.Root>
        );
      },
    },
    { accessorKey: "value", header: t("roles.permissions.columnPermission") },
    {
      accessorKey: "description",
      header: t("roles.permissions.columnDescription"),
      cell: ({ getValue }) => getValue<string | null>() ?? "—",
    },
  ];

  const { permissions, ...pagination } = data;

  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold py-2">
          {t("roles.permissions.title")}
        </h2>
        {isDirty && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        )}
      </div>
      <DataTable
        columns={columns}
        data={permissions}
        isLoading={loading}
        pagination={pagination}
      />
    </section>
  );
}
