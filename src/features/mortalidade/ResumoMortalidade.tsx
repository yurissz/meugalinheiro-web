import { MetricCard } from "../../shared/components/MetricCard";
import { formatarNumero } from "../../shared/format";
import type { LoteResponse } from "../lote/types";

interface ResumoMortalidadeProps {
  lote?: LoteResponse;
  totalMortas: number;
  totalRegistros: number;
  carregando: boolean;
}

export function ResumoMortalidade({ lote, totalMortas, totalRegistros, carregando }: ResumoMortalidadeProps) {
  const percentual =
    lote && lote.quantidadeInicial > 0 ? Math.round((totalMortas / lote.quantidadeInicial) * 1000) / 10 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] mb-5">
      <MetricCard
        label="Perdas do lote"
        value={`${formatarNumero(totalMortas)} ave${totalMortas === 1 ? "" : "s"}`}
        hint={carregando ? undefined : `em ${totalRegistros} registro${totalRegistros === 1 ? "" : "s"}`}
        tom={totalMortas > 0 ? "neg" : undefined}
      />
      <MetricCard
        label="Taxa de mortalidade"
        value={`${percentual.toLocaleString("pt-BR")}%`}
        hint={lote ? `sobre ${formatarNumero(lote.quantidadeInicial)} aves iniciais` : undefined}
      />
      <MetricCard
        label="Aves vivas hoje"
        value={lote ? formatarNumero(lote.avesVivas) : "—"}
        hint={lote?.fase}
      />
    </div>
  );
}
