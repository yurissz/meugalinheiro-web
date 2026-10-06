import { hojeIso } from "../../shared/format";
import type { MortalidadeResponse } from "./types";

export interface DadosFormularioMortalidade {
  loteId: string;
  data: string;
  quantidade: string;
  causa: string;
}

export function mortalidadeVazia(loteId = ""): DadosFormularioMortalidade {
  return { loteId, data: hojeIso(), quantidade: "1", causa: "" };
}

export function dadosDaMortalidade(
  registro: MortalidadeResponse | null,
  loteInicialId = "",
): DadosFormularioMortalidade {
  if (!registro) return mortalidadeVazia(loteInicialId);
  return {
    loteId: registro.loteId,
    data: registro.data,
    quantidade: String(registro.quantidade),
    causa: registro.causa ?? "",
  };
}

export function mesmosDadosDeMortalidade(a: DadosFormularioMortalidade, b: DadosFormularioMortalidade): boolean {
  return a.loteId === b.loteId && a.data === b.data && a.quantidade === b.quantidade && a.causa === b.causa;
}
