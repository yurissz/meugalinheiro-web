import { apiRequest } from "../../shared/api/client";
import type { PaginaResposta } from "../../shared/api/pagina";
import type { LoteRequest, LoteResponse } from "./types";

export interface FiltroLotes {
  nome?: string;
  raca?: string;
  ativo?: boolean;
}

// A API não garante ordem sem um "sort" explícito (confirmado no manifesto de paginação
// do backend) — sem isso, itens podem repetir ou sumir ao trocar de página. Pedimos por
// data de entrada mais recente primeiro.
export function listarLotes(pagina = 0, tamanho = 20, filtro: FiltroLotes = {}): Promise<PaginaResposta<LoteResponse>> {
  const parametros = new URLSearchParams();
  parametros.set("page", String(pagina));
  parametros.set("size", String(tamanho));
  parametros.set("sort", "dataEntrada,desc");
  if (filtro.nome) parametros.set("nome", filtro.nome);
  if (filtro.raca) parametros.set("raca", filtro.raca);
  if (filtro.ativo !== undefined) parametros.set("ativo", String(filtro.ativo));
  return apiRequest<PaginaResposta<LoteResponse>>(`/lotes?${parametros.toString()}`);
}

// Telas que usam lotes pra select/lookup (não pra listar com paginação) precisam do catálogo
// inteiro de uma vez; pedimos uma única página grande o bastante pra cobrir o volume real.
// A API limita "size" a 2000 silenciosamente (sem erro) — contas com mais de 2000 lotes não
// teriam o catálogo completo aqui; não é o caso hoje, mas é uma limitação real a saber.
export function listarTodosLotes(): Promise<LoteResponse[]> {
  return listarLotes(0, 2000).then((resposta) => resposta.content);
}

export function criarLote(dados: LoteRequest): Promise<LoteResponse> {
  return apiRequest<LoteResponse>("/lotes", { method: "POST", body: dados });
}

export function atualizarLote(id: string, dados: LoteRequest): Promise<LoteResponse> {
  return apiRequest<LoteResponse>(`/lotes/${id}`, { method: "PUT", body: dados });
}

export function excluirLote(id: string): Promise<void> {
  return apiRequest<void>(`/lotes/${id}`, { method: "DELETE" });
}

export function obterLote(id: string): Promise<LoteResponse> {
  return apiRequest<LoteResponse>(`/lotes/${id}`);
}
