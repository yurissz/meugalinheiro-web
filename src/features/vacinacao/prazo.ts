import { formatarDataBR } from "../../shared/format";
import type { VacinacaoResponse } from "./types";

const MS_POR_DIA = 86_400_000;

export function diasAte(dataIso: string, hojeIso: string): number {
  const alvo = new Date(`${dataIso}T00:00:00`).getTime();
  const referencia = new Date(`${hojeIso}T00:00:00`).getTime();
  return Math.round((alvo - referencia) / MS_POR_DIA);
}

function textoDeAtraso(dias: number): string {
  if (dias === 1) return "Atrasada desde ontem";
  return `Atrasada há ${dias} dias`;
}

function textoDeVencimento(dias: number): string {
  if (dias === 0) return "Vence hoje";
  if (dias === 1) return "Vence amanhã";
  if (dias <= 7) return `Vence em ${dias} dias`;
  return "";
}

export function textoDePrazo(vacinacao: VacinacaoResponse, hojeIso: string): string {
  if (vacinacao.dataAplicada) return `Aplicada em ${formatarDataBR(vacinacao.dataAplicada)}`;
  if (!vacinacao.dataPrevista) return "Sem data prevista";

  const dias = diasAte(vacinacao.dataPrevista, hojeIso);
  if (dias < 0) return textoDeAtraso(-dias);

  return textoDeVencimento(dias) || `Prevista para ${formatarDataBR(vacinacao.dataPrevista)}`;
}
