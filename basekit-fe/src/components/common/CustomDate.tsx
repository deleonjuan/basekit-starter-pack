interface CustomDateProps {
  value: string | Date;
}

export default function CustomDate({ value }: CustomDateProps) {
  const date =
    typeof value === "string" && !isNaN(Number(value))
      ? new Date(Number(value))
      : new Date(value);

  const formatted = date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return <span>{formatted}</span>;
}
