import { apiRequest } from "../../shared/api/client";
import type { ResumoResponse } from "./types";

export function obterResumo(ano: number, mes: number): Promise<ResumoResponse> {
  return apiRequest<ResumoResponse>(`/resumo?ano=${ano}&mes=${mes}`);
}
