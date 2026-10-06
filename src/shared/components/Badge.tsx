import type { HTMLAttributes } from "react";

type Tom = "ok" | "warn" | "bad" | "neutro";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tom: Tom;
}

const classesPorTom: Record<Tom, string> = {
  ok: "bg-verde-claro text-verde",
  warn: "bg-gema-bg text-gema-texto",
  bad: "bg-terra-bg text-terra",
  neutro: "bg-palha-escura text-tinta",
};

export function Badge({ tom, className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[11.5px] font-medium px-[10px] py-[3px] rounded-full ${classesPorTom[tom]} ${className}`}
      {...props}
    />
  );
}
