import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Botao } from "../../shared/components/Botao";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { Skeleton } from "../../shared/components/Skeleton";
import { useConfirmacao } from "../../shared/components/useConfirmacao";
import { useCadastroEmOverlay } from "../../shared/hooks/useCadastroEmOverlay";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerMensagemDeErro } from "../../shared/api/errosFormulario";
import { hojeIso } from "../../shared/format";
import { CAMINHOS } from "../../shared/navegacao";
import { FiltroLote } from "../lote/FiltroLote";
import { listarTodosLotes } from "../lote/api";
import type { LoteResponse } from "../lote/types";
import { excluirTipoVacina, listarTiposVacina } from "../tipoVacina/api";
import type { TipoVacinaResponse } from "../tipoVacina/types";
import { listarVacinacoesPendentes } from "./api";
import { MinhasVacinas } from "./catalogo/MinhasVacinas";
import { TipoVacinaEmOverlay } from "./catalogo/TipoVacinaEmOverlay";
import { HistoricoAplicacoes } from "./historico/HistoricoAplicacoes";
import { EstadoVazio } from "./lista/EstadoVazio";
import { FaixaAtrasadas } from "./lista/FaixaAtrasadas";
import { LinhaVacinacao } from "./lista/LinhaVacinacao";
import { SecaoFixa } from "./lista/SecaoFixa";
import { SecaoRecolhivel } from "./lista/SecaoRecolhivel";
import { agruparPorStatus, comDadosDoLote, pendenciasVisiveis } from "./pendencias";
import { VacinacaoEmOverlay } from "./programar/VacinacaoEmOverlay";
import type { VacinacaoComLote, VacinacaoResponse } from "./types";
import { useAcoesVacinacao } from "./useAcoesVacinacao";

type OverlayVacinacao =
  | { modo: "programar" }
  | { modo: "editarAplicacao"; vacinacao: VacinacaoComLote }
  | { modo: "cadastrarVacina" }
  | { modo: "editarVacina"; tipo: TipoVacinaResponse };

interface BaseVacinacao {
  lotes: LoteResponse[];
  tiposVacina: TipoVacinaResponse[];
}

const BASE_VAZIA: BaseVacinacao = { lotes: [], tiposVacina: [] };

async function carregarBase(): Promise<BaseVacinacao> {
  const [lotes, tiposVacina] = await Promise.all([listarTodosLotes(), listarTiposVacina()]);
  return { lotes, tiposVacina };
}

function EsqueletoPendencias() {
  return (
    <div className="bg-white border border-borda rounded-app overflow-hidden mb-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-6 px-[14px] py-[15px] border-b border-[#F0EBDD] last:border-b-0">
          <div className="flex-1">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function VacinacaoPage() {
  const navegar = useNavigate();
  const { cadastro, abrir, fechar } = useCadastroEmOverlay<OverlayVacinacao>();
  const { confirmar, dialogo: dialogoCatalogo } = useConfirmacao();
  const { notificarSucesso, notificarErro } = useNotificacao();

  const [loteId, setLoteId] = useState("");
  const [versaoHistorico, setVersaoHistorico] = useState(0);

  const {
    dados: { lotes, tiposVacina },
    carregando: carregandoBase,
    erro: erroBase,
    recarregar: recarregarBase,
  } = useRecurso<BaseVacinacao>(
    carregarBase,
    BASE_VAZIA,
    [],
    "Não foi possível carregar a vacinação. Verifique se a API está rodando.",
  );

  const {
    dados: pendentes,
    carregando: carregandoPendentes,
    erro: erroPendentes,
    recarregar: recarregarPendentes,
  } = useRecurso<VacinacaoResponse[]>(
    listarVacinacoesPendentes,
    [],
    [],
    "Não foi possível carregar as vacinas pendentes.",
  );

  function recarregarAplicacoes() {
    recarregarPendentes();
    setVersaoHistorico((versao) => versao + 1);
  }

  const { aplicandoId, aplicar, excluir, dialogo: dialogoAcoes } = useAcoesVacinacao(recarregarAplicacoes);

  async function handleArquivarVacina(tipo: TipoVacinaResponse) {
    const confirmado = await confirmar({
      titulo: "Arquivar vacina",
      mensagem: (
        <>
          <strong>{tipo.nome}</strong> deixa de aparecer ao programar novas aplicações. As aplicações já registradas
          continuam no histórico.
        </>
      ),
      textoConfirmar: "Arquivar",
      destrutivo: true,
    });
    if (!confirmado) return;

    try {
      await excluirTipoVacina(tipo.id);
      notificarSucesso(`${tipo.nome} foi arquivada.`);
      recarregarBase();
    } catch (capturado) {
      notificarErro(lerMensagemDeErro(capturado, "Não foi possível arquivar a vacina."));
    }
  }

  const hoje = hojeIso();
  const pendentesComLote = comDadosDoLote(pendentes, lotes);
  const visiveis = pendenciasVisiveis(pendentesComLote, loteId);
  const { atrasadas, proximas, programadas } = agruparPorStatus(visiveis);

  const loteSelecionado = lotes.find((lote) => lote.id === loteId);
  const temLoteAtivo = lotes.some((lote) => lote.ativo);
  const mostrarLote = !loteId;
  const carregando = carregandoBase || carregandoPendentes;
  const nuncaProgramou = pendentes.length === 0 && tiposVacina.length === 0;

  function linhaDe(vacinacao: VacinacaoComLote) {
    return (
      <LinhaVacinacao
        key={vacinacao.id}
        vacinacao={vacinacao}
        hoje={hoje}
        mostrarLote={mostrarLote}
        aplicando={aplicandoId === vacinacao.id}
        aoAplicar={aplicar}
        aoEditar={(item) => abrir({ modo: "editarAplicacao", vacinacao: item })}
        aoExcluir={excluir}
      />
    );
  }

  return (
    <div>
      <CabecalhoPagina titulo="Vacinação" subtitulo="O que está atrasado, o que vence agora e o que já foi feito" />

      {(erroBase || erroPendentes) && (
        <div
          role="alert"
          className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4"
        >
          {erroBase ?? erroPendentes}
        </div>
      )}

      {lotes.length === 0 && !carregandoBase ? (
        <EstadoVazio
          titulo="Cadastre um lote primeiro"
          descricao="As vacinas são programadas para um lote de aves. Assim que existir um lote, você programa a vacinação dele aqui."
        >
          <Botao variante="primary" onClick={() => navegar(CAMINHOS.lotes)}>
            Ir para Lotes
          </Botao>
        </EstadoVazio>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-4">
            <FiltroLote lotes={lotes} valor={loteId} onChange={setLoteId} opcaoTodos="Todos os lotes" />
            {temLoteAtivo && (
              <Botao variante="primary" className="font-semibold" onClick={() => abrir({ modo: "programar" })}>
                + Programar vacina
              </Botao>
            )}
          </div>

          {loteSelecionado && !loteSelecionado.ativo && (
            <p className="bg-palha-escura text-tinta rounded-app px-4 py-[11px] text-[13px] mb-4">
              Lote encerrado — o histórico continua aqui, mas não é possível programar novas vacinas.
            </p>
          )}

          {carregando ? (
            <EsqueletoPendencias />
          ) : (
            <>
              {atrasadas.length > 0 && (
                <FaixaAtrasadas quantidade={atrasadas.length}>{atrasadas.map(linhaDe)}</FaixaAtrasadas>
              )}

              {proximas.length > 0 && (
                <SecaoFixa titulo="Esta semana" quantidade={proximas.length} tom="warn">
                  {proximas.map(linhaDe)}
                </SecaoFixa>
              )}

              {programadas.length > 0 && (
                <SecaoRecolhivel
                  titulo="Mais pra frente"
                  quantidade={programadas.length}
                  tom="ok"
                  abertaInicialmente
                  vazio="Nada programado pra frente."
                >
                  {programadas.map(linhaDe)}
                </SecaoRecolhivel>
              )}

              {visiveis.length === 0 &&
                (nuncaProgramou ? (
                  <EstadoVazio
                    titulo="Comece programando uma vacina"
                    descricao="Diga qual vacina o lote precisa e quando. O app passa a avisar quando cada uma vencer — você não precisa cadastrar nada antes."
                  >
                    <Botao variante="primary" onClick={() => abrir({ modo: "programar" })}>
                      Programar primeira vacina
                    </Botao>
                  </EstadoVazio>
                ) : (
                  <EstadoVazio
                    titulo="Nenhuma vacina pendente"
                    descricao={
                      loteSelecionado
                        ? `Não há nada pendente em ${loteSelecionado.nome}.`
                        : "Não há nada pendente nos seus lotes ativos."
                    }
                  >
                    {temLoteAtivo && (
                      <Botao variante="primary" onClick={() => abrir({ modo: "programar" })}>
                        + Programar vacina
                      </Botao>
                    )}
                  </EstadoVazio>
                ))}
            </>
          )}

          <HistoricoAplicacoes
            lotes={lotes}
            loteId={loteId}
            hoje={hoje}
            versao={versaoHistorico}
            aoEditar={(item) => abrir({ modo: "editarAplicacao", vacinacao: item })}
            aoExcluir={excluir}
          />

          <MinhasVacinas
            tiposVacina={tiposVacina}
            aoCadastrar={() => abrir({ modo: "cadastrarVacina" })}
            aoEditar={(tipo) => abrir({ modo: "editarVacina", tipo })}
            aoArquivar={handleArquivarVacina}
          />
        </>
      )}

      {(cadastro?.modo === "programar" || cadastro?.modo === "editarAplicacao") && (
        <VacinacaoEmOverlay
          lotes={lotes}
          tiposVacina={tiposVacina}
          loteInicialId={cadastro.modo === "editarAplicacao" ? cadastro.vacinacao.loteId : loteId}
          vacinacao={cadastro.modo === "editarAplicacao" ? cadastro.vacinacao : null}
          aoFechar={fechar}
          aoSalvar={() => {
            recarregarBase();
            recarregarAplicacoes();
          }}
        />
      )}

      {(cadastro?.modo === "cadastrarVacina" || cadastro?.modo === "editarVacina") && (
        <TipoVacinaEmOverlay
          tipo={cadastro.modo === "editarVacina" ? cadastro.tipo : null}
          aoFechar={fechar}
          aoSalvar={recarregarBase}
        />
      )}

      {dialogoAcoes}
      {dialogoCatalogo}
    </div>
  );
}
