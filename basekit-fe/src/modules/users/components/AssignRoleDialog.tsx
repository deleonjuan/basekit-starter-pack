import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "#/components/ui/combobox";
import { AppDialog } from "#/components/common";
import { useGetRoles } from "#/modules/roles/queries/roles.query";
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
  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");

  const { data } = useGetRoles();
  const [assignRole, { loading, error }] = useAssignRole();

  const assignedIds = new Set(assignedRoles.map((r) => r.id));
  const availableRoles = (data.roles ?? []).filter(
    (r) => !assignedIds.has(r.id),
  );

  const filteredRoles = availableRoles.filter(
    (role) =>
      !inputValue || role.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const handleAccept = async () => {
    if (!selectedRoleId) return;
    await assignRole({
      variables: { userId, roleId: selectedRoleId },
      onCompleted: () => {
        setOpen(false);
        setSelectedRoleId(null);
        setInputValue("");
      },
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedRoleId(null);
      setInputValue("");
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<Button variant="outline" />}
      triggerLabel="Asignar rol"
      title="Asignar rol"
      onSubmit={handleAccept}
      onSubmitLabel={loading ? "Asignando..." : "Aceptar"}
      disable={!selectedRoleId || loading}
    >
      <Combobox
        items={filteredRoles.map((role) => ({
          value: role.id,
          label: role.name,
        }))}
        onValueChange={({ value }: any) => setSelectedRoleId(value)}
      >
        <ComboboxInput placeholder="Buscar rol..." />
        <ComboboxPopup>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
          <ComboboxEmpty>No se encontraron roles</ComboboxEmpty>
        </ComboboxPopup>
      </Combobox>
      {error && (
        <p className="mt-2 text-sm text-destructive">
          {error.message ?? "Error al asignar el rol."}
        </p>
      )}
    </AppDialog>
  );
}
