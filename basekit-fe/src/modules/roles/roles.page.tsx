import { useNavigate } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import DataTable, { type IPagination } from "#/components/common/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetRoles } from "./queries/roles.query";
import type { Role } from "./queries/roles.query";
import { CreateRoleDialog } from "./components/CreateRoleDialog";

const columns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function RolesPage() {
  const {
    data: { roles, ...pagination },
    loading,
  } = useGetRoles();
  const navigate = useNavigate();

  const onRoleClick = (role: Role) => {
    navigate({
      to: "/admin/roles/$roleId",
      params: { roleId: role.id },
      search: { page: 1 },
    });
  };

  return (
    <AppPage title="Roles" headerRightComponent={<CreateRoleDialog />}>
      <DataTable
        columns={columns}
        data={roles ?? []}
        isLoading={loading}
        pagination={pagination as IPagination}
        onRowClick={onRoleClick}
      />
    </AppPage>
  );
}
