export interface MortalidadeRequest {
  loteId: string;
  data: string;
  quantidade: number;
  causa?: string;
}

export interface MortalidadeEditarRequest {
  data: string;
  quantidade: number;
  causa?: string;
}

export interface MortalidadeResponse {
  id: string;
  loteId: string;
  data: string;
  quantidade: number;
  /** O backend manda `null` (não `undefined`) quando o produtor não preencheu. */
  causa: string | null;
}

export interface MortalidadeResumoResponse {
  loteId: string;
  totalMortas: number;
}
