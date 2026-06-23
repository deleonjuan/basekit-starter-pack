import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { AppPage } from "#/lib/universal-layout/";
import DataTable, { type IPagination } from "#/components/common/DataTable";
import {
  CustomDate,
  SearchBar,
  withPermissions,
  Permissions,
} from "#/components/common";
import type { ColumnDef } from "@tanstack/react-table";
import { useGetUsers } from "./queries/users.query";
import type { User } from "./queries/users.query";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { PERMISSIONS } from "#/lib/permissions";

export const UsersPage = withPermissions(() => {
  const { page, search } = useSearch({ strict: false });
  const { t } = useTranslation();
  const {
    data: { users, ...pagination },
    loading,
  } = useGetUsers(page, search);
  const navigate = useNavigate();

  const columns: ColumnDef<User>[] = [
    { accessorKey: "username", header: t("users.table.username") },
    {
      accessorKey: "isActive",
      header: t("users.table.active"),
      cell: ({ getValue }) =>
        getValue<boolean>() ? (
          <Badge variant="success">{t("users.table.activeStatus")}</Badge>
        ) : (
          <Badge variant="destructive">{t("users.table.inactiveStatus")}</Badge>
        ),
    },
    {
      accessorKey: "createdAt",
      header: t("users.table.createdAt"),
      cell: ({ getValue }) => <CustomDate value={getValue<string>()} />,
    },
  ];

  return (
    <AppPage
      title={t("users.page.title")}
      headerRightComponent={
        <Permissions required={[PERMISSIONS.USERS.WRITE]}>
          <Link to="/admin/users/new">
            <Button>{t("users.page.new")}</Button>
          </Link>
        </Permissions>
      }
    >
      <DataTable
        header={<SearchBar />}
        columns={columns}
        data={users ?? []}
        isLoading={loading}
        pagination={pagination as IPagination}
        onRowClick={(e) =>
          navigate({ to: "/admin/users/$userId", params: { userId: e.id } })
        }
      />
    </AppPage>
  );
}, [PERMISSIONS.USERS.READ]);
