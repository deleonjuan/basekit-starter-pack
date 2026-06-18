import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { SimpleDataTable } from "#/components/common/DataTable";
import { CustomDate } from "#/components/common";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
} from "#/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import type { UserRole } from "../queries/getUser.query";
import { AssignRoleDialog } from "./AssignRoleDialog";
import { useRevokeRole } from "../queries/revokeRole.mutation";

interface RevokeRoleButtonProps {
  userId: string;
  role: UserRole;
}

function RevokeRoleButton({ userId, role }: RevokeRoleButtonProps) {
  const [open, setOpen] = useState(false);
  const [revokeRole, { loading }] = useRevokeRole();

  const handleConfirm = async () => {
    await revokeRole({
      variables: { userId, roleId: role.id },
      onCompleted: () => setOpen(false),
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2Icon size={16} />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPopup showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Desasignar rol</DialogTitle>
          </DialogHeader>
          <DialogPanel>
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro que deseas desasignar el rol{" "}
              <span className="font-medium text-foreground">{role.name}</span>{" "}
              de este usuario?
            </p>
          </DialogPanel>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              type="button"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              type="button"
              disabled={loading}
            >
              {loading ? "Desasignando..." : "Desasignar"}
            </Button>
          </DialogFooter>
        </DialogPopup>
      </Dialog>
    </>
  );
}

function getColumns(userId: string): ColumnDef<UserRole>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
    },
    {
      accessorKey: "description",
      header: "Descripción",
      cell: ({ getValue }) => getValue<string | null>() ?? "—",
    },
    {
      accessorKey: "createdAt",
      header: "Asignado",
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
  return (
    <section className="flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Roles</h2>
        <AssignRoleDialog userId={userId} assignedRoles={roles} />
      </div>
      <SimpleDataTable
        columns={getColumns(userId)}
        data={roles}
        isLoading={loading}
        hideHeaders={roles.length < 1}
        noInfoBanner={
          <div className="bg-muted flex justify-center py-4">
            Asigna un rol a este usuario
          </div>
        }
      />
    </section>
  );
}
