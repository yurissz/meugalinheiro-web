import type { VacinacaoResponse } from "../vacinacao/types";

export interface ResumoResponse {
  // Mudam com o mês/ano filtrado.
  lucroDoPeriodo: number;
  mortalidadeDoPeriodo: number;
  // Sempre o estado atual (hoje) — não respeitam o filtro de mês/ano.
  avesAtivas: number;
  proximaVacinaPendente: VacinacaoResponse | null;
}
