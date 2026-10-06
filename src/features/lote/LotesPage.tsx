import { useState } from "react";
import { Botao } from "../../shared/components/Botao";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { CampoBusca } from "../../shared/components/CampoBusca";
import { PainelTabela } from "../../shared/components/PainelTabela";
import { Paginacao } from "../../shared/components/Paginacao";
import { SeletorSegmentado } from "../../shared/components/SeletorSegmentado";
import { Skeleton } from "../../shared/components/Skeleton";
import { useConfirmacao } from "../../shared/components/useConfirmacao";
import { usePaginacao } from "../../shared/hooks/usePaginacao";
import { useCadastroEmOverlay } from "../../shared/hooks/useCadastroEmOverlay";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerMensagemDeErro } from "../../shared/api/errosFormulario";
import { excluirLote, listarLotes, type FiltroLotes } from "./api";
import { ListaLotes } from "./ListaLotes";
import { LoteEmOverlay } from "./LoteEmOverlay";
import type { LoteResponse } from "./types";
import { listarVacinacoesPendentes } from "../vacinacao/api";
import type { VacinacaoResponse } from "../vacinacao/types";

type FiltroStatusLote = "todos" | "ativos" | "inativos";

type CadastroDeLote = { modo: "novo" } | { modo: "edicao"; lote: LoteResponse };

export function LotesPage() {
  const { cadastro, abrir, fechar } = useCadastroEmOverlay<CadastroDeLote>();
  const { confirmar, dialogo } = useConfirmacao();
  const { notificarSucesso } = useNotificacao();

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaRaca, setBuscaRaca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatusLote>("ativos");
  const nomeComAtraso = useDebounce(buscaNome, 400);
  const racaComAtraso = useDebounce(buscaRaca, 400);

  const filtro: FiltroLotes = {
    nome: nomeComAtraso || undefined,
    raca: racaComAtraso || undefined,
    ativo: filtroStatus === "todos" ? undefined : filtroStatus === "ativos",
  };
  const temFiltrosAtivos = buscaNome !== "" || buscaRaca !== "" || filtroStatus !== "ativos";

  function limparFiltros() {
    setBuscaNome("");
    setBuscaRaca("");
    setFiltroStatus("ativos");
  }

  const {
    itens: lotes,
    pagina,
    totalPaginas,
    totalElementos,
    carregando,
    erro: erroPaginacao,
    paginaAnterior,
    proximaPagina,
    primeiraPagina,
    ultimaPagina,
    recarregar: recarregarLotes,
  } = usePaginacao(
    (pagina, tamanho) => listarLotes(pagina, tamanho, filtro),
    20,
    [nomeComAtraso, racaComAtraso, filtroStatus],
    "Não foi possível carregar os lotes. Verifique se a API está rodando.",
  );

  const {
    dados: pendentes,
    erro: erroPendentes,
    recarregar: recarregarPendentes,
  } = useRecurso<VacinacaoResponse[]>(
    () => listarVacinacoesPendentes(),
    [],
    [],
    "Não foi possível carregar o status de vacinação dos lotes.",
  );

  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const mensagemErro = erroAcao ?? erroPaginacao ?? erroPendentes;

  function recarregarTudo() {
    recarregarLotes();
    recarregarPendentes();
  }

  async function handleEncerrar(lote: LoteResponse) {
    const confirmado = await confirmar({
      titulo: "Encerrar lote",
      mensagem: (
        <>
          O lote <strong>{lote.nome}</strong> sai da lista de ativos. O histórico de vendas, gastos e mortalidade
          dele continua guardado.
        </>
      ),
      textoConfirmar: "Encerrar lote",
      destrutivo: true,
    });
    if (!confirmado) return;

    setErroAcao(null);
    try {
      await excluirLote(lote.id);
      notificarSucesso(`Lote ${lote.nome} encerrado. O histórico continua guardado.`);
      recarregarTudo();
    } catch (capturado) {
      setErroAcao(lerMensagemDeErro(capturado, "Não foi possível encerrar o lote."));
    }
  }

  return (
    <div>
      <CabecalhoPagina
        titulo="Meus lotes"
        subtitulo="Cada lote agrupa aves da mesma idade"
        acao={
          <Botao variante="inverso" onClick={() => abrir({ modo: "novo" })} className="w-full sm:w-auto">
            + Novo lote
          </Botao>
        }
      />

      {mensagemErro && (
        <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
          {mensagemErro}
        </div>
      )}

      <PainelTabela
        temFiltrosAtivos={temFiltrosAtivos}
        aoLimpar={limparFiltros}
        filtros={
          <>
            <CampoBusca value={buscaNome} onChange={setBuscaNome} placeholder="Buscar por nome..." className="w-auto min-w-[180px]" />
            <CampoBusca value={buscaRaca} onChange={setBuscaRaca} placeholder="Buscar por raça..." className="w-auto min-w-[180px]" />
            <SeletorSegmentado
              rotulo="Situação dos lotes"
              opcoes={[
                { valor: "ativos", rotulo: "Ativos" },
                { valor: "inativos", rotulo: "Encerrados" },
                { valor: "todos", rotulo: "Todos" },
              ]}
              valor={filtroStatus}
              onChange={setFiltroStatus}
              className="sm:w-[310px]"
            />
          </>
        }
      >
        {carregando ? (
          <div>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-6 px-[14px] py-[13px] border-b border-[#F0EBDD] last:border-b-0">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24 rounded-full ml-auto" />
              </div>
            ))}
          </div>
        ) : lotes.length === 0 ? (
          <div className="text-center text-[13px] py-[30px] px-4">
            {temFiltrosAtivos ? (
              <span className="text-cinza">Nenhum lote encontrado com esses filtros.</span>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <span className="text-cinza">Nenhum lote cadastrado ainda.</span>
                <Botao variante="primary" onClick={() => abrir({ modo: "novo" })}>
                  Cadastrar o primeiro lote
                </Botao>
              </div>
            )}
          </div>
        ) : (
          <ListaLotes
            lotes={lotes}
            pendentes={pendentes}
            aoEditar={(lote) => abrir({ modo: "edicao", lote })}
            aoEncerrar={handleEncerrar}
          />
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
        carregando={carregando}
      />

      {cadastro && (
        <LoteEmOverlay
          lote={cadastro.modo === "edicao" ? cadastro.lote : null}
          aoFechar={fechar}
          aoSalvar={recarregarTudo}
        />
      )}

      {dialogo}
    </div>
  );
}
