export interface TipoVacinaRequest {
  nome: string;
  idadeSemanasRecomendada?: number;
}

export interface TipoVacinaResponse {
  id: string;
  nome: string;
  /** O backend manda `null` (não `undefined`) quando não há idade recomendada. */
  idadeSemanasRecomendada: number | null;
  /** Arquivar é exclusão lógica: o tipo some do catálogo mas o histórico continua. */
  ativo: boolean;
}
