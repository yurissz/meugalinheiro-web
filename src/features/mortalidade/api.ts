import { apiRequest } from "../../shared/api/client";
import type { PaginaResposta } from "../../shared/api/pagina";
import type { MortalidadeEditarRequest, MortalidadeRequest, MortalidadeResponse, MortalidadeResumoResponse } from "./types";

export function listarMortalidades(
  pagina = 0,
  tamanho = 20,
  loteId?: string,
): Promise<PaginaResposta<MortalidadeResponse>> {
  const parametros = new URLSearchParams();
  if (loteId) parametros.set("loteId", loteId);
  parametros.set("page", String(pagina));
  parametros.set("size", String(tamanho));
  parametros.append("sort", "data,desc");
  parametros.append("sort", "id,desc");
  return apiRequest<PaginaResposta<MortalidadeResponse>>(`/mortalidades?${parametros.toString()}`);
}

// Últimos registros de todos os lotes do produtor no mês, numa chamada só. Antes o feed
// do painel buscava mortalidade lote a lote (dezenas de requisições por carregamento).
export function listarMortalidadesRecentes(ano: number, mes: number, limite = 10): Promise<MortalidadeResponse[]> {
  return apiRequest<MortalidadeResponse[]>(`/mortalidades/recentes?ano=${ano}&mes=${mes}&limite=${limite}`);
}

// Totais agregados por lote numa única chamada — não devolve os eventos individuais
// (data/causa), só o total morto por lote. Lote sem mortalidade ainda aparece, com 0.
export function resumoMortalidadePorLotes(loteIds: string[]): Promise<MortalidadeResumoResponse[]> {
  if (loteIds.length === 0) return Promise.resolve([]);
  return apiRequest<MortalidadeResumoResponse[]>(`/mortalidades/resumo?loteIds=${loteIds.join(",")}`);
}

export function criarMortalidade(dados: MortalidadeRequest): Promise<MortalidadeResponse> {
  return apiRequest<MortalidadeResponse>("/mortalidades", { method: "POST", body: dados });
}

export function atualizarMortalidade(id: string, dados: MortalidadeEditarRequest): Promise<MortalidadeResponse> {
  return apiRequest<MortalidadeResponse>(`/mortalidades/${id}`, { method: "PUT", body: dados });
}

export function excluirMortalidade(id: string): Promise<void> {
  return apiRequest<void>(`/mortalidades/${id}`, { method: "DELETE" });
}
