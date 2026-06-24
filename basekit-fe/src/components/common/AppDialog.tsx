import React from "react";
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
  icon?: React.ReactNode;
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
  isAlert?: boolean;
}

export function AppDialog({
  open,
  onOpenChange,
  trigger,
  triggerLabel,
  icon,
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
  isAlert = false,
}: AppDialogProps) {
  const submitVariant = properties?.submitButton?.variant ?? "default";
  const submitClassName = properties?.submitButton?.className;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const alertFooterClass = isAlert ? "flex-col-reverse! gap-3!" : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger render={trigger}>{triggerLabel}</DialogTrigger>
      <DialogPopup
        showCloseButton={showCloseButton}
        className={isAlert ? "w-80" : undefined}
      >
        <DialogHeader>
          {React.isValidElement(icon) &&
            React.cloneElement(
              icon as React.ReactElement<{ size?: number; className: string }>,
              {
                size:
                  (icon as React.ReactElement<{ size?: number }>).props.size ??
                  50,
                className: "mb-4",
              },
            )}
          <DialogTitle className={isAlert ? "text-base" : undefined}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <DialogPanel>{children}</DialogPanel>
        <DialogFooter variant="bare" className={alertFooterClass}>
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
