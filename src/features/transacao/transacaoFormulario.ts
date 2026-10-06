import { hojeIso } from "../../shared/format";
import type { TipoTransacao, TransacaoResponse } from "./types";

export interface DadosFormularioTransacao {
  tipo: TipoTransacao;
  categoria: string;
  valor: string;
  data: string;
  loteId: string;
  descricao: string;
}

export function transacaoVazia(): DadosFormularioTransacao {
  return { tipo: "RECEITA", categoria: "", valor: "", data: hojeIso(), loteId: "", descricao: "" };
}

export function dadosDaTransacao(transacao: TransacaoResponse | null): DadosFormularioTransacao {
  if (!transacao) return transacaoVazia();
  return {
    tipo: transacao.tipo,
    categoria: transacao.categoria,
    valor: String(transacao.valor),
    data: transacao.data,
    loteId: transacao.loteId ?? "",
    descricao: transacao.descricao ?? "",
  };
}

export function mesmosDadosDeTransacao(a: DadosFormularioTransacao, b: DadosFormularioTransacao): boolean {
  return (
    a.tipo === b.tipo &&
    a.categoria === b.categoria &&
    a.valor === b.valor &&
    a.data === b.data &&
    a.loteId === b.loteId &&
    a.descricao === b.descricao
  );
}
