import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      default: "",
      title: "text-3xl font-bold",
      subtitle: "text-xl font-semi",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export default function Typography({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "title" | "subtitle";
}) {
  return (
    <span className={cn(typographyVariants({ variant, className }))}>
      {children}
    </span>
  );
}
