import type React from "react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogPanel,
  DialogFooter,
} from "#/components/ui/dialog";

interface AppDialogProperties {
  submitButton?: {
    variant?: React.ComponentProps<typeof Button>["variant"];
    className?: string;
  };
}

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactElement;
  triggerLabel?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  formId?: string;
  onCancel?: () => void;
  onSubmit?: () => void;
  onCancelLabel?: string;
  onSubmitLabel?: string;
  disable?: boolean;
  properties?: AppDialogProperties;
  showCloseButton?: boolean;
}

export function AppDialog({
  open,
  onOpenChange,
  trigger,
  triggerLabel,
  title,
  children,
  formId,
  onCancel,
  onSubmit,
  onCancelLabel = "Cancelar",
  onSubmitLabel = "Aceptar",
  disable,
  properties,
  showCloseButton = true,
}: AppDialogProps) {
  const submitVariant = properties?.submitButton?.variant ?? "default";
  const submitClassName = properties?.submitButton?.className;
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger}>{triggerLabel}</DialogTrigger>
      <DialogPopup showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogPanel>{children}</DialogPanel>
        <DialogFooter variant="bare">
          <Button variant="outline" type="button" onClick={handleCancel}>
            {onCancelLabel}
          </Button>
          {formId ? (
            <Button
              form={formId}
              type="submit"
              disabled={disable}
              variant={submitVariant}
              className={submitClassName}
            >
              {onSubmitLabel}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={onSubmit}
              disabled={disable}
              variant={submitVariant}
              className={submitClassName}
            >
              {onSubmitLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
