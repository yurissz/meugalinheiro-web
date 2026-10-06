import { apiRequest } from "../../shared/api/client";
import type { PaginaResposta } from "../../shared/api/pagina";
import type {
  MarcarAplicadaRequest,
  VacinacaoAtualizarRequest,
  VacinacaoRequest,
  VacinacaoResponse,
} from "./types";

export interface FiltroVacinacoes {
  loteId?: string;
  aplicada?: boolean;
  tipoVacinaId?: string;
}

export function listarVacinacoes(
  pagina = 0,
  tamanho = 20,
  filtro: FiltroVacinacoes = {},
): Promise<PaginaResposta<VacinacaoResponse>> {
  const parametros = new URLSearchParams();
  parametros.set("page", String(pagina));
  parametros.set("size", String(tamanho));
  // Sem ordem explícita, o banco não garante a mesma sequência entre uma página e outra
  // — o mesmo registro pode aparecer duas vezes ou sumir ao avançar. O id desempata as
  // aplicações que caem no mesmo dia, senão a data sozinha deixa a ordem instável.
  parametros.append("sort", "dataPrevista,desc");
  parametros.append("sort", "id,desc");
  if (filtro.loteId) parametros.set("loteId", filtro.loteId);
  if (filtro.aplicada !== undefined) parametros.set("aplicada", String(filtro.aplicada));
  if (filtro.tipoVacinaId) parametros.set("tipoVacinaId", filtro.tipoVacinaId);
  return apiRequest<PaginaResposta<VacinacaoResponse>>(`/vacinacoes?${parametros.toString()}`);
}

// Endpoint não mudou: continua sem paginação, retorna array simples.
export function listarVacinacoesPendentes(): Promise<VacinacaoResponse[]> {
  return apiRequest<VacinacaoResponse[]>("/vacinacoes/pendentes");
}

export function criarVacinacao(dados: VacinacaoRequest): Promise<VacinacaoResponse> {
  return apiRequest<VacinacaoResponse>("/vacinacoes", { method: "POST", body: dados });
}

export function atualizarVacinacao(id: string, dados: VacinacaoAtualizarRequest): Promise<VacinacaoResponse> {
  return apiRequest<VacinacaoResponse>(`/vacinacoes/${id}`, { method: "PUT", body: dados });
}

export function marcarVacinacaoAplicada(id: string, dados: MarcarAplicadaRequest = {}): Promise<VacinacaoResponse> {
  return apiRequest<VacinacaoResponse>(`/vacinacoes/${id}/aplicar`, { method: "PATCH", body: dados });
}

export function excluirVacinacao(id: string): Promise<void> {
  return apiRequest<void>(`/vacinacoes/${id}`, { method: "DELETE" });
}

/*
 * Desfazer uma marcação. `PATCH /aplicar` recusa quem já foi aplicada, então a volta para
 * pendente é um PUT sem `dataAplicada` — confirmado contra a API: devolve `dataAplicada:
 * null` e o status recalculado.
 */
export function desmarcarVacinacaoAplicada(
  id: string,
  dados: Omit<VacinacaoAtualizarRequest, "dataAplicada">,
): Promise<VacinacaoResponse> {
  return apiRequest<VacinacaoResponse>(`/vacinacoes/${id}`, { method: "PUT", body: dados });
}
