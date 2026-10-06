export interface LoteRequest {
  nome: string;
  dataEntrada: string;
  quantidadeInicial: number;
  raca?: string;
}

export interface LoteResponse {
  id: string;
  nome: string;
  dataEntrada: string;
  quantidadeInicial: number;
  avesVivas: number;
  /** O backend manda `null` (não `undefined`) quando o produtor não preencheu. */
  raca: string | null;
  idadeSemanas: number;
  fase: string;
  /** Lote encerrado fica ativo=false (a exclusão no backend é lógica, não apaga). */
  ativo: boolean;
}
