import { compararDataIso } from "../../shared/format";
import type { LoteResponse } from "../lote/types";
import type { VacinacaoComLote, VacinacaoResponse } from "./types";

export interface GruposDePendencia {
  atrasadas: VacinacaoComLote[];
  proximas: VacinacaoComLote[];
  programadas: VacinacaoComLote[];
}

const GRUPOS_VAZIOS: GruposDePendencia = { atrasadas: [], proximas: [], programadas: [] };

export function comDadosDoLote(vacinacoes: VacinacaoResponse[], lotes: LoteResponse[]): VacinacaoComLote[] {
  const porId = new Map(lotes.map((lote) => [lote.id, lote]));

  return vacinacoes.map((vacinacao) => {
    const lote = porId.get(vacinacao.loteId);
    return {
      ...vacinacao,
      loteNome: lote?.nome ?? "Lote removido",
      loteAtivo: lote?.ativo ?? false,
    };
  });
}

/*
 * A API devolve as pendências de todos os lotes, encerrados inclusive. Na visão geral um
 * lote encerrado acumularia "atrasadas" para sempre e afogaria a urgência real — ele só
 * aparece quando o produtor escolhe aquele lote no filtro, para consultar o histórico.
 */
export function pendenciasVisiveis(pendentes: VacinacaoComLote[], loteIdSelecionado: string): VacinacaoComLote[] {
  if (loteIdSelecionado) return pendentes.filter((vacinacao) => vacinacao.loteId === loteIdSelecionado);
  return pendentes.filter((vacinacao) => vacinacao.loteAtivo);
}

export function agruparPorStatus(pendentes: VacinacaoComLote[]): GruposDePendencia {
  if (pendentes.length === 0) return GRUPOS_VAZIOS;

  const grupos: GruposDePendencia = { atrasadas: [], proximas: [], programadas: [] };

  for (const vacinacao of pendentes) {
    if (vacinacao.status === "Atrasada") grupos.atrasadas.push(vacinacao);
    else if (vacinacao.status === "Próxima") grupos.proximas.push(vacinacao);
    else grupos.programadas.push(vacinacao);
  }

  const porDataPrevista = (a: VacinacaoComLote, b: VacinacaoComLote) =>
    compararDataIso(a.dataPrevista, b.dataPrevista);

  return {
    atrasadas: [...grupos.atrasadas].sort(porDataPrevista),
    proximas: [...grupos.proximas].sort(porDataPrevista),
    programadas: [...grupos.programadas].sort(porDataPrevista),
  };
}
