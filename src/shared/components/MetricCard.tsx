import type { ReactNode } from "react";
import { Card } from "./Card";

interface MetricCardProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tom?: "pos" | "neg";
  /** Substitui o valor por "****" (ex.: modo privado) — a cor de tom some junto, pra não vazar se é positivo/negativo. */
  oculto?: boolean;
}

const corPorTom: Record<"pos" | "neg", string> = {
  pos: "text-verde",
  neg: "text-terra",
};

export function MetricCard({ label, value, hint, tom, oculto }: MetricCardProps) {
  return (
    <Card>
      <div className="text-xs text-cinza mb-[6px] flex items-center gap-[6px]">{label}</div>
      <div className={`font-heading text-2xl font-semibold ${!oculto && tom ? corPorTom[tom] : "text-tinta"}`}>
        {oculto ? "****" : value}
      </div>
      {hint && <div className="text-[11.5px] text-cinza-claro mt-1">{hint}</div>}
    </Card>
  );
}
