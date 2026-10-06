import { apiRequest } from "../../shared/api/client";
import type { TipoVacinaRequest, TipoVacinaResponse } from "./types";

export function listarTiposVacina(): Promise<TipoVacinaResponse[]> {
  return apiRequest<TipoVacinaResponse[]>("/tipos-vacina");
}

export function criarTipoVacina(dados: TipoVacinaRequest): Promise<TipoVacinaResponse> {
  return apiRequest<TipoVacinaResponse>("/tipos-vacina", { method: "POST", body: dados });
}

export function atualizarTipoVacina(id: string, dados: TipoVacinaRequest): Promise<TipoVacinaResponse> {
  return apiRequest<TipoVacinaResponse>(`/tipos-vacina/${id}`, { method: "PUT", body: dados });
}

export function excluirTipoVacina(id: string): Promise<void> {
  return apiRequest<void>(`/tipos-vacina/${id}`, { method: "DELETE" });
}
