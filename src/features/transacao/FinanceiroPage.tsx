import { useState } from "react";
import { Botao } from "../../shared/components/Botao";
import { BotaoVisibilidade } from "../../shared/components/BotaoVisibilidade";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { Card } from "../../shared/components/Card";
import { MetricCard } from "../../shared/components/MetricCard";
import { AcoesTabela } from "../../shared/components/BotaoIcone";
import { CampoBusca } from "../../shared/components/CampoBusca";
import { LINHA_NO_MOBILE, LISTA_NO_MOBILE, PainelTabela } from "../../shared/components/PainelTabela";
import { Paginacao } from "../../shared/components/Paginacao";
import { SeletorSegmentado } from "../../shared/components/SeletorSegmentado";
import { SeletorMes } from "../../shared/components/SeletorMes";
import { Skeleton } from "../../shared/components/Skeleton";
import { useConfirmacao } from "../../shared/components/useConfirmacao";
import { useCadastroEmOverlay } from "../../shared/hooks/useCadastroEmOverlay";
import { usePaginacao } from "../../shared/hooks/usePaginacao";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useValoresVisiveis } from "../../shared/hooks/useValoresVisiveis";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerMensagemDeErro } from "../../shared/api/errosFormulario";
import { anoMesAtual, formatarDataBR, formatarMoeda } from "../../shared/format";
import { listarTodosLotes } from "../lote/api";
import { FiltroLote } from "../lote/FiltroLote";
import type { LoteResponse } from "../lote/types";
import {
  excluirTransacao,
  listarTodasTransacoesDoMes,
  listarTransacoes,
  obterLucro,
  type FiltroTransacoes,
} from "./api";
import { TransacaoEmOverlay } from "./TransacaoEmOverlay";
import type { TipoTransacao, TransacaoResponse } from "./types";

type FiltroTipoTransacao = "todos" | TipoTransacao;

type CadastroDeTransacao = { modo: "nova" } | { modo: "edicao"; transacao: TransacaoResponse };

interface DadosDoMes {
  transacoes: TransacaoResponse[];
  lotes: LoteResponse[];
  lucroMesAnterior: number | null;
}

const MES_VAZIO: DadosDoMes = { transacoes: [], lotes: [], lucroMesAnterior: null };

/*
 * Os cards de resumo e a repartição por categoria precisam do mês inteiro — não dá pra
 * derivar isso só da página visível na tabela. O lucro do mês anterior vem junto, pra
 * comparação, já tratando a virada de ano.
 */
async function carregarMes(ano: number, mes: number): Promise<DadosDoMes> {
  const mesAnterior = mes === 1 ? 12 : mes - 1;
  const anoDoMesAnterior = mes === 1 ? ano - 1 : ano;
  const [transacoes, lotes, lucroMesAnterior] = await Promise.all([
    listarTodasTransacoesDoMes(ano, mes),
    listarTodosLotes(),
    obterLucro(anoDoMesAnterior, mesAnterior),
  ]);
  return { transacoes, lotes, lucroMesAnterior };
}

export function FinanceiroPage() {
  const { cadastro, abrir, fechar } = useCadastroEmOverlay<CadastroDeTransacao>();
  const { confirmar, dialogo } = useConfirmacao();
  const { notificarSucesso } = useNotificacao();
  const [{ ano, mes }, setAnoMes] = useState(anoMesAtual());
  const { visivel, alternar: alternarVisibilidade, controlavel: mostrarBotaoVisibilidade } = useValoresVisiveis();

  const {
    dados: { transacoes, lotes, lucroMesAnterior },
    carregando,
    erro,
    recarregar: recarregarMes,
  } = useRecurso<DadosDoMes>(
    () => carregarMes(ano, mes),
    MES_VAZIO,
    [ano, mes],
    "Não foi possível carregar o financeiro. Verifique se a API está rodando.",
  );

  // Filtros da tabela de movimentações — não afetam os cards de resumo nem a repartição
  // por categoria, que sempre mostram o total real do mês selecionado.
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipoTransacao>("todos");
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [filtroLoteId, setFiltroLoteId] = useState("");
  const categoriaComAtraso = useDebounce(buscaCategoria, 400);

  const filtroTabela: FiltroTransacoes = {
    tipo: filtroTipo === "todos" ? undefined : filtroTipo,
    categoria: categoriaComAtraso || undefined,
    loteId: filtroLoteId || undefined,
  };
  const temFiltrosAtivos = filtroTipo !== "todos" || buscaCategoria !== "" || filtroLoteId !== "";

  function limparFiltros() {
    setFiltroTipo("todos");
    setBuscaCategoria("");
    setFiltroLoteId("");
  }

  const {
    itens: transacoesPagina,
    pagina,
    totalPaginas,
    totalElementos,
    carregando: carregandoTabela,
    erro: erroTabela,
    paginaAnterior,
    proximaPagina,
    primeiraPagina,
    ultimaPagina,
    recarregar: recarregarTabela,
  } = usePaginacao(
    (pagina, tamanho) => listarTransacoes(ano, mes, pagina, tamanho, filtroTabela),
    20,
    [ano, mes, filtroTipo, categoriaComAtraso, filtroLoteId],
    "Não foi possível carregar as movimentações. Verifique se a API está rodando.",
  );

  const [erroAcao, setErroAcao] = useState<string | null>(null);

  const mensagemErro = erroAcao ?? erro ?? erroTabela;

  function recarregar() {
    recarregarTabela();
    recarregarMes();
  }

  function nomeDoLote(id?: string | null): string {
    if (!id) return "—";
    return lotes.find((lote) => lote.id === id)?.nome ?? "—";
  }

  async function handleExcluir(transacao: TransacaoResponse) {
    const confirmado = await confirmar({
      titulo: "Excluir movimentação",
      mensagem: (
        <>
          <strong>{transacao.categoria}</strong> de {formatarMoeda(transacao.valor)} em{" "}
          {formatarDataBR(transacao.data)} será apagada. Isso muda o lucro do mês.
        </>
      ),
      textoConfirmar: "Excluir",
      destrutivo: true,
    });
    if (!confirmado) return;

    setErroAcao(null);
    try {
      await excluirTransacao(transacao.id);
      notificarSucesso(`${transacao.categoria} de ${formatarMoeda(transacao.valor)} foi excluída.`);
      recarregar();
    } catch (capturado) {
      setErroAcao(lerMensagemDeErro(capturado, "Não foi possível excluir a movimentação."));
    }
  }

  const receitas = transacoes.filter((t) => t.tipo === "RECEITA").reduce((soma, t) => soma + t.valor, 0);
  const despesas = transacoes.filter((t) => t.tipo === "DESPESA").reduce((soma, t) => soma + t.valor, 0);
  const lucro = receitas - despesas;

  const transacoesOrdenadas = [...transacoesPagina].sort((a, b) => b.data.localeCompare(a.data));

  // Sem os dados do mês, os cards mostrariam "R$ 0,00" — um zero inventado é pior que
  // nenhum número, porque parece um mês sem movimento em vez de uma falha de conexão.
  const falhouSemDados = Boolean(erro) && transacoes.length === 0;

  return (
    <div>
      <CabecalhoPagina
        titulo="Financeiro"
        subtitulo={
          <>
            <SeletorMes ano={ano} mes={mes} onChange={setAnoMes} escuro />
            <div className="text-white/75 text-[12px] mt-0.5">só da criação, separado do dinheiro de casa</div>
          </>
        }
        acao={
          <div className="flex items-center gap-[10px] w-full sm:w-auto">
            {mostrarBotaoVisibilidade && <BotaoVisibilidade visivel={visivel} onClick={alternarVisibilidade} escuro />}
            <Botao variante="inverso" onClick={() => abrir({ modo: "nova" })} className="flex-1 sm:flex-none">
              + Venda ou gasto
            </Botao>
          </div>
        }
      />

      {mensagemErro && (
        <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
          {mensagemErro}
        </div>
      )}

      {falhouSemDados ? null : carregando ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-7 w-28" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
            <MetricCard label="Receitas" value={formatarMoeda(receitas)} hint="venda de ovos e aves" tom="pos" oculto={!visivel} />
            <MetricCard label="Despesas" value={formatarMoeda(despesas)} tom="neg" oculto={!visivel} />
            <MetricCard
              label="Lucro"
              value={formatarMoeda(lucro)}
              tom={lucro >= 0 ? "pos" : "neg"}
              oculto={!visivel}
              hint={
                visivel && lucroMesAnterior !== null
                  ? `${lucro - lucroMesAnterior >= 0 ? "+" : ""}${formatarMoeda(lucro - lucroMesAnterior)} vs. mês anterior`
                  : undefined
              }
            />
          </div>

          <div className="mt-5">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold mb-3">Movimentações do mês</div>

              <PainelTabela
                temFiltrosAtivos={temFiltrosAtivos}
                aoLimpar={limparFiltros}
                filtros={
                  <>
                    <SeletorSegmentado
                      rotulo="Tipo de movimentação"
                      opcoes={[
                        { valor: "todos", rotulo: "Todos" },
                        { valor: "RECEITA", rotulo: "Receita" },
                        { valor: "DESPESA", rotulo: "Despesa" },
                      ]}
                      valor={filtroTipo}
                      onChange={setFiltroTipo}
                      className="sm:w-[260px]"
                    />
                    <CampoBusca
                      value={buscaCategoria}
                      onChange={setBuscaCategoria}
                      placeholder="Buscar por categoria..."
                      className="w-auto min-w-[180px]"
                    />
                    <FiltroLote
                      lotes={lotes}
                      valor={filtroLoteId}
                      onChange={setFiltroLoteId}
                      opcaoTodos="Todos os lotes"
                    />
                  </>
                }
              >
                {carregandoTabela && transacoesOrdenadas.length === 0 ? (
                  <div>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-6 px-[14px] py-[13px] border-b border-[#F0EBDD] last:border-b-0">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                      </div>
                    ))}
                  </div>
                ) : transacoesOrdenadas.length === 0 ? (
                  <div className="text-center text-cinza-claro text-[13px] py-[30px]">
                    {temFiltrosAtivos
                      ? "Nenhuma movimentação encontrada com esses filtros."
                      : "Nenhuma movimentação neste mês."}
                  </div>
                ) : (
                  <>
                    <div className={LISTA_NO_MOBILE}>
                      {transacoesOrdenadas.map((transacao) => (
                        <div key={transacao.id} className={LINHA_NO_MOBILE}>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <div className="font-semibold text-[13.5px] min-w-0 truncate">
                              {transacao.categoria}
                              {transacao.descricao ? ` · ${transacao.descricao}` : ""}
                            </div>
                            <div className={`text-[13.5px] whitespace-nowrap flex-shrink-0 ${transacao.tipo === "RECEITA" ? "text-verde" : "text-terra"}`}>
                              {transacao.tipo === "RECEITA" ? "+ " : "− "}
                              {formatarMoeda(transacao.valor)}
                            </div>
                          </div>
                          <div className="text-[12px] text-cinza mb-3">
                            {formatarDataBR(transacao.data)} · {nomeDoLote(transacao.loteId)}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Botao onClick={() => abrir({ modo: "edicao", transacao })}>Editar</Botao>
                            <Botao onClick={() => handleExcluir(transacao)}>Excluir</Botao>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="hidden md:block">
                      <table className="w-full border-collapse table-fixed">
                        <thead>
                          <tr>
                            <th className="w-[120px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                              Data
                            </th>
                            <th className="text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                              Categoria
                            </th>
                            <th className="w-[150px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                              Lote
                            </th>
                            <th className="w-[140px] text-right text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                              Valor
                            </th>
                            <th className="w-[96px] px-3 py-[10px] border-b border-borda">
                              <span className="sr-only">Ações</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {transacoesOrdenadas.map((transacao) => {
                            const categoriaCompleta = transacao.descricao
                              ? `${transacao.categoria} · ${transacao.descricao}`
                              : transacao.categoria;
                            return (
                              <tr key={transacao.id} className="hover:bg-[#FBF8F0]">
                                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] whitespace-nowrap">
                                  {formatarDataBR(transacao.data)}
                                </td>
                                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={categoriaCompleta}>
                                  {categoriaCompleta}
                                </td>
                                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={nomeDoLote(transacao.loteId)}>
                                  {nomeDoLote(transacao.loteId)}
                                </td>
                                <td
                                  className={`px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] text-right whitespace-nowrap ${
                                    transacao.tipo === "RECEITA" ? "text-verde" : "text-terra"
                                  }`}
                                >
                                  {transacao.tipo === "RECEITA" ? "+ " : "− "}
                                  {formatarMoeda(transacao.valor)}
                                </td>
                                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px]">
                                  <AcoesTabela
                                    aoEditar={() => abrir({ modo: "edicao", transacao })}
                                    aoExcluir={() => handleExcluir(transacao)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </PainelTabela>

              <Paginacao
                pagina={pagina}
                totalPaginas={totalPaginas}
                totalElementos={totalElementos}
                aoAnterior={paginaAnterior}
                aoProximo={proximaPagina}
                aoIrParaPrimeira={primeiraPagina}
                aoIrParaUltima={ultimaPagina}
                carregando={carregandoTabela}
              />
            </div>

          </div>
        </>
      )}

      {cadastro && (
        <TransacaoEmOverlay
          lotes={lotes}
          transacao={cadastro.modo === "edicao" ? cadastro.transacao : null}
          aoFechar={fechar}
          aoSalvar={recarregar}
        />
      )}

      {dialogo}
    </div>
  );
}
