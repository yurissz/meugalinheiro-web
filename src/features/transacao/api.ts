import { apiRequest } from "../../shared/api/client";
import type { PaginaResposta } from "../../shared/api/pagina";
import type { TipoTransacao, TransacaoRequest, TransacaoResponse } from "./types";

export interface FiltroTransacoes {
  tipo?: TipoTransacao;
  categoria?: string;
  loteId?: string;
}

export function listarTransacoes(
  ano?: number,
  mes?: number,
  pagina = 0,
  tamanho = 20,
  filtro: FiltroTransacoes = {},
): Promise<PaginaResposta<TransacaoResponse>> {
  const parametros = new URLSearchParams();
  if (ano !== undefined) parametros.set("ano", String(ano));
  if (mes !== undefined) parametros.set("mes", String(mes));
  if (filtro.tipo) parametros.set("tipo", filtro.tipo);
  if (filtro.categoria) parametros.set("categoria", filtro.categoria);
  if (filtro.loteId) parametros.set("loteId", filtro.loteId);
  parametros.set("page", String(pagina));
  parametros.set("size", String(tamanho));
  return apiRequest<PaginaResposta<TransacaoResponse>>(`/transacoes?${parametros.toString()}`);
}

// Cards de resumo (receitas/despesas/categoria) precisam do mês inteiro, não só da página
// visível na tabela — pedimos uma única página grande o bastante pra cobrir o volume mensal.
// Sempre o total do mês, sem os filtros de tipo/categoria/lote da tabela (que são só pra
// achar um lançamento específico, não pra recalcular os totais do período).
// A API limita "size" a 2000 silenciosamente (sem erro) — um único mês com mais de 2000
// lançamentos não viria completo aqui; não é o caso hoje, mas é uma limitação real a saber.
export function listarTodasTransacoesDoMes(ano: number, mes: number): Promise<TransacaoResponse[]> {
  return listarTransacoes(ano, mes, 0, 2000).then((resposta) => resposta.content);
}

export function obterLucro(ano: number, mes: number): Promise<number> {
  return apiRequest<number>(`/transacoes/lucro?ano=${ano}&mes=${mes}`);
}

export function criarTransacao(dados: TransacaoRequest): Promise<TransacaoResponse> {
  return apiRequest<TransacaoResponse>("/transacoes", { method: "POST", body: dados });
}

export function atualizarTransacao(id: string, dados: TransacaoRequest): Promise<TransacaoResponse> {
  return apiRequest<TransacaoResponse>(`/transacoes/${id}`, { method: "PUT", body: dados });
}

export function excluirTransacao(id: string): Promise<void> {
  return apiRequest<void>(`/transacoes/${id}`, { method: "DELETE" });
}
