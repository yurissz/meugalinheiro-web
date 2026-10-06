import { useState } from "react";
import { Botao } from "../../shared/components/Botao";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { Paginacao } from "../../shared/components/Paginacao";
import { Skeleton } from "../../shared/components/Skeleton";
import { useConfirmacao } from "../../shared/components/useConfirmacao";
import { useCadastroEmOverlay } from "../../shared/hooks/useCadastroEmOverlay";
import { usePaginacao } from "../../shared/hooks/usePaginacao";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerMensagemDeErro } from "../../shared/api/errosFormulario";
import { formatarDataBR } from "../../shared/format";
import { listarTodosLotes } from "../lote/api";
import { PainelTabela } from "../../shared/components/PainelTabela";
import { FiltroLote } from "../lote/FiltroLote";
import type { LoteResponse } from "../lote/types";
import { excluirMortalidade, listarMortalidades, resumoMortalidadePorLotes } from "./api";
import { ListaMortalidade } from "./ListaMortalidade";
import { MortalidadeEmOverlay } from "./MortalidadeEmOverlay";
import { ResumoMortalidade } from "./ResumoMortalidade";
import type { MortalidadeResponse } from "./types";

type CadastroDeMortalidade = { modo: "novo" } | { modo: "edicao"; registro: MortalidadeResponse };

export function MortalidadePage() {
  const { cadastro, abrir, fechar } = useCadastroEmOverlay<CadastroDeMortalidade>();
  const { confirmar, dialogo } = useConfirmacao();
  const { notificarSucesso } = useNotificacao();

  const {
    dados: lotes,
    carregando: carregandoLotes,
    erro: erroLotes,
    recarregar: recarregarLotes,
  } = useRecurso<LoteResponse[]>(
    () => listarTodosLotes(),
    [],
    [],
    "Não foi possível carregar a lista de lotes. Verifique se a API está rodando.",
  );

  const [loteId, setLoteId] = useState("");
  const loteSelecionado = lotes.find((lote) => lote.id === loteId);

  function nomeDoLote(id: string): string {
    return lotes.find((lote) => lote.id === id)?.nome ?? "—";
  }

  const {
    itens: registros,
    pagina,
    totalPaginas,
    totalElementos,
    carregando: carregandoRegistros,
    erro: erroRegistros,
    paginaAnterior,
    proximaPagina,
    primeiraPagina,
    ultimaPagina,
    recarregar: recarregarRegistros,
  } = usePaginacao(
    (pagina, tamanho) => listarMortalidades(pagina, tamanho, loteId || undefined),
    20,
    [loteId],
    "Não foi possível carregar os registros de mortalidade.",
  );

  const { dados: resumo, recarregar: recarregarResumo } = useRecurso(
    () => resumoMortalidadePorLotes(loteId ? [loteId] : []),
    [],
    [loteId],
    "Não foi possível carregar o total de perdas deste lote.",
  );
  const totalMortas = resumo[0]?.totalMortas ?? 0;

  const [erroAcao, setErroAcao] = useState<string | null>(null);

  const mensagemErro = erroAcao ?? erroLotes ?? erroRegistros;
  const semLotes = !carregandoLotes && !erroLotes && lotes.length === 0;

  function recarregarTudo() {
    recarregarRegistros();
    recarregarResumo();
    recarregarLotes();
  }

  async function handleExcluir(registro: MortalidadeResponse) {
    const confirmado = await confirmar({
      titulo: "Excluir registro",
      mensagem: (
        <>
          O registro de{" "}
          <strong>
            {registro.quantidade} ave{registro.quantidade === 1 ? "" : "s"}
          </strong>{" "}
          em {formatarDataBR(registro.data)} será apagado, e as aves voltam pra contagem de vivas do lote.
        </>
      ),
      textoConfirmar: "Excluir",
      destrutivo: true,
    });
    if (!confirmado) return;

    setErroAcao(null);
    try {
      await excluirMortalidade(registro.id);
      notificarSucesso("Registro excluído. As aves voltaram pra contagem do lote.");
      recarregarTudo();
    } catch (capturado) {
      setErroAcao(lerMensagemDeErro(capturado, "Não foi possível excluir o registro."));
    }
  }

  return (
    <div>
      <CabecalhoPagina
        titulo="Mortalidade"
        subtitulo="Histórico de perdas de cada lote"
        acao={
          lotes.length > 0 && (
            <Botao variante="inverso" onClick={() => abrir({ modo: "novo" })} className="w-full sm:w-auto">
              + Registrar perda
            </Botao>
          )
        }
      />

      {mensagemErro && (
        <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
          {mensagemErro}
        </div>
      )}

      {erroLotes && lotes.length === 0 ? null : semLotes ? (
        <div className="bg-white border border-borda rounded-app text-center text-[13px] py-[30px] px-4 text-cinza">
          Cadastre um lote antes de registrar mortalidade.
        </div>
      ) : (
        <>
          {loteSelecionado && (
            <ResumoMortalidade
              lote={loteSelecionado}
              totalMortas={totalMortas}
              totalRegistros={totalElementos}
              carregando={carregandoRegistros}
            />
          )}

          <h2 className="text-[15px] font-semibold mb-3">
            {loteSelecionado ? "Registros do lote" : "Todas as perdas"}
          </h2>

          <PainelTabela
            temFiltrosAtivos={loteId !== ""}
            aoLimpar={() => setLoteId("")}
            filtros={<FiltroLote lotes={lotes} valor={loteId} onChange={setLoteId} opcaoTodos="Todos os lotes" />}
          >
            {carregandoLotes || carregandoRegistros ? (
              <div>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-6 px-[14px] py-[13px] border-b border-[#F0EBDD] last:border-b-0">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                ))}
              </div>
            ) : registros.length === 0 ? (
              <div className="text-center text-[13px] py-[30px] px-4">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-cinza">
                    {loteSelecionado
                      ? "Nenhuma perda registrada neste lote — que continue assim."
                      : "Nenhuma perda registrada — que continue assim."}
                  </span>
                  <Botao variante="primary" onClick={() => abrir({ modo: "novo" })}>
                    Registrar uma perda
                  </Botao>
                </div>
              </div>
            ) : (
              <ListaMortalidade
                registros={registros}
                nomeDoLote={loteSelecionado ? undefined : nomeDoLote}
                aoEditar={(registro) => abrir({ modo: "edicao", registro })}
                aoExcluir={handleExcluir}
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
            carregando={carregandoRegistros}
          />
        </>
      )}

      {cadastro && (
        <MortalidadeEmOverlay
          lotes={lotes}
          loteInicialId={loteId}
          registro={cadastro.modo === "edicao" ? cadastro.registro : null}
          aoFechar={fechar}
          aoSalvar={recarregarTudo}
        />
      )}

      {dialogo}
    </div>
  );
}
