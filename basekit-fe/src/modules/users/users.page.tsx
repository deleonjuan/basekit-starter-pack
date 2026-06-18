import { Link, useNavigate } from "@tanstack/react-router";
import { AppPage } from "#/lib/universal-layout/";
import DataTable, { type IPagination } from "#/components/common/DataTable";
import { CustomDate } from "#/components/common";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetUsers } from "./queries/users.query";
import type { User } from "./queries/users.query";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";

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
    cell: ({ getValue }) => <CustomDate value={getValue<string>()} />,
  },
];

export function UsersPage() {
  const {
    data: { users, ...pagination },
    loading,
  } = useGetUsers();
  const navigate = useNavigate();

  const onUserClick = (e: User) => {
    navigate({ to: "/admin/users/$userId", params: { userId: e.id } });
  };

  return (
    <AppPage
      title="Users"
      headerRightComponent={
        <Link to="/admin/users/new">
          <Button>Nuevo</Button>
        </Link>
      }
    >
      <DataTable
        columns={columns}
        data={users ?? []}
        isLoading={loading}
        pagination={pagination as IPagination}
        onRowClick={onUserClick}
      />
    </AppPage>
  );
}
