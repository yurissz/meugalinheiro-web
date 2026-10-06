export interface VacinacaoRequest {
  loteId: string;
  tipoVacinaId: string;
  dataPrevista: string;
  dataAplicada?: string;
}

export interface VacinacaoAtualizarRequest {
  tipoVacinaId: string;
  dataPrevista: string;
  dataAplicada?: string;
}

export interface MarcarAplicadaRequest {
  dataAplicada?: string;
}

export interface VacinacaoResponse {
  id: string;
  loteId: string;
  tipoVacinaId: string;
  tipoVacinaNome: string;
  dataPrevista: string;
  /** O backend manda `null` (não `undefined`) enquanto a vacina não foi aplicada. */
  dataAplicada: string | null;
  status: string;
}

/** A resposta da API só traz `loteId`; o nome do lote vem do cruzamento com a lista de lotes. */
export interface VacinacaoComLote extends VacinacaoResponse {
  loteNome: string;
  loteAtivo: boolean;
}
