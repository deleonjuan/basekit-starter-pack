import { AppPage } from "#/lib/universal-layout/";
import DataTable, { type IPagination } from "#/components/common/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetUsers } from "./queries/users.query";
import type { User } from "./queries/users.query";
import { Badge } from "#/components/ui/badge";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => {
      const active = getValue<boolean>();

      return active ? (
        <Badge variant={"success"}>Activo</Badge>
      ) : (
        <Badge variant={"destructive"}>Inactivo</Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
  },
];

export function UsersPage() {
  const {
    data: { users, ...pagination },
    loading,
  } = useGetUsers();

  return (
    <AppPage title="Users">
      <DataTable
        columns={columns}
        data={users ?? []}
        isLoading={loading}
        pagination={pagination as IPagination}
      />
    </AppPage>
  );
}
