import { useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import DataTable, { type IPagination } from "#/components/common/DataTable";
import { CustomDate, SearchBar } from "#/components/common";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetRoles } from "./queries/roles.query";
import type { Role } from "./queries/roles.query";
import { CreateRoleDialog } from "./components/CreateRoleDialog";

export function RolesPage() {
  const { page, search } = useSearch({ strict: false });
  const { t } = useTranslation();
  const {
    data: { roles, ...pagination },
    loading,
  } = useGetRoles(page, search);
  const navigate = useNavigate();

  const columns: ColumnDef<Role>[] = [
    { accessorKey: "name", header: t("roles.table.name") },
    {
      accessorKey: "createdAt",
      header: t("roles.table.createdAt"),
      cell: ({ getValue }) => <CustomDate value={getValue<string>()} />,
    },
  ];

  const onRoleClick = (role: Role) => {
    navigate({
      to: "/admin/roles/$roleId",
      params: { roleId: role.id },
      search: { page: 1 },
    });
  };

  return (
    <AppPage
      title={t("roles.page.title")}
      headerRightComponent={<CreateRoleDialog />}
    >
      <DataTable
        header={<SearchBar />}
        columns={columns}
        data={roles ?? []}
        isLoading={loading}
        pagination={pagination as IPagination}
        onRowClick={onRoleClick}
      />
    </AppPage>
  );
}
