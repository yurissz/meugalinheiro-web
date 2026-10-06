import { hojeIso } from "../../shared/format";
import type { LoteResponse } from "./types";

export interface DadosFormularioLote {
  nome: string;
  dataEntrada: string;
  quantidadeInicial: string;
  raca: string;
}

export function loteVazio(): DadosFormularioLote {
  return { nome: "", dataEntrada: hojeIso(), quantidadeInicial: "", raca: "" };
}

export function dadosDoLote(lote: LoteResponse | null): DadosFormularioLote {
  if (!lote) return loteVazio();
  return {
    nome: lote.nome,
    dataEntrada: lote.dataEntrada,
    quantidadeInicial: String(lote.quantidadeInicial),
    raca: lote.raca ?? "",
  };
}

export function mesmosDadosDeLote(a: DadosFormularioLote, b: DadosFormularioLote): boolean {
  return (
    a.nome === b.nome &&
    a.dataEntrada === b.dataEntrada &&
    a.quantidadeInicial === b.quantidadeInicial &&
    a.raca === b.raca
  );
}
