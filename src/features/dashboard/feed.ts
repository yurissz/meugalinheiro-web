import type { LoteResponse } from "../lote/types";
import { listarMortalidadesRecentes } from "../mortalidade/api";
import { listarTodasTransacoesDoMes } from "../transacao/api";
import { formatarMoeda } from "../../shared/format";

export interface ItemFeed {
  data: string;
  tipo: "Mortalidade" | "Venda" | "Gasto";
  loteNome: string;
  detalhe: string;
}

/*
 * Não existe um endpoint único de "últimos registros" (o feed mistura mortalidade +
 * venda + gasto), então são duas chamadas: uma de transações do mês e uma de
 * mortalidades recentes. Antes eram duas **dezenas** delas — uma por lote, porque
 * GET /mortalidades exigia loteId. O endpoint /mortalidades/recentes resolveu isso no
 * backend; no 4G do sítio a diferença é de segundos.
 *
 * `ano`/`mes` seguem o período selecionado no painel — igual ao lucro/mortalidade do
 * resumo, esse feed não é "estado atual", é "o que aconteceu nesse período".
 */
export async function carregarFeedRecente(lotes: LoteResponse[], ano: number, mes: number, limite = 5): Promise<ItemFeed[]> {
  const mapaNomesLote = new Map(lotes.map((lote) => [lote.id, lote.nome]));

  const [transacoes, mortalidades] = await Promise.all([
    listarTodasTransacoesDoMes(ano, mes),
    listarMortalidadesRecentes(ano, mes, limite),
  ]);

  const itensTransacao: ItemFeed[] = transacoes.map((transacao) => ({
    data: transacao.data,
    tipo: transacao.tipo === "RECEITA" ? "Venda" : "Gasto",
    loteNome: transacao.loteId ? (mapaNomesLote.get(transacao.loteId) ?? "—") : "—",
    detalhe: `${formatarMoeda(transacao.valor)} · ${transacao.categoria}`,
  }));

  const itensMortalidade: ItemFeed[] = mortalidades.map((mortalidade) => ({
    data: mortalidade.data,
    tipo: "Mortalidade",
    loteNome: mapaNomesLote.get(mortalidade.loteId) ?? "—",
    detalhe: `${mortalidade.quantidade} ave${mortalidade.quantidade > 1 ? "s" : ""}${
      mortalidade.causa ? ` · ${mortalidade.causa}` : ""
    }`,
  }));

  return [...itensTransacao, ...itensMortalidade].sort((a, b) => b.data.localeCompare(a.data)).slice(0, limite);
}
