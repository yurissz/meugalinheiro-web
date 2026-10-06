export type TipoTransacao = "RECEITA" | "DESPESA";

export interface TransacaoRequest {
  tipo: TipoTransacao;
  categoria: string;
  valor: number;
  data: string;
  loteId?: string;
  descricao?: string;
}

export interface TransacaoResponse {
  id: string;
  tipo: TipoTransacao;
  categoria: string;
  valor: number;
  data: string;
  /** O backend manda `null` (não `undefined`) quando o lançamento não é de um lote. */
  loteId: string | null;
  descricao: string | null;
}
