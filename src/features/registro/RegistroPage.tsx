import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Botao } from "../../shared/components/Botao";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { Card } from "../../shared/components/Card";
import { CampoCustomizado, CampoTexto } from "../../shared/components/Campo";
import { Skeleton } from "../../shared/components/Skeleton";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../shared/api/errosFormulario";
import { iconeOvo, iconePena, iconeTrigo } from "../../shared/icons";
import { anoMesAtual, formatarDataBR, formatarMoeda, hojeIso } from "../../shared/format";
import { listarTodosLotes } from "../lote/api";
import { SeletorLote } from "../lote/SeletorLote";
import type { LoteResponse } from "../lote/types";
import { criarMortalidade } from "../mortalidade/api";
import { criarTransacao } from "../transacao/api";
import type { TipoTransacao } from "../transacao/types";
import { carregarFeedRecente, type ItemFeed } from "../dashboard/feed";

type TipoRegistro = "mortalidade" | "venda" | "gasto";

const rotuloTipo: Record<TipoRegistro, string> = { mortalidade: "Mortalidade", venda: "Venda", gasto: "Gasto" };

// Cada tipo de registro ganha um ícone e uma cor do próprio sistema visual do app —
// mortalidade usa o tom de alerta (gema), venda o de receita (verde), gasto o de despesa
// (terra), igual ao resto do Financeiro. Ajuda a reconhecer o tipo num relance.
const iconePorTipo: Record<TipoRegistro, ReactNode> = {
  mortalidade: iconePena,
  venda: iconeOvo,
  gasto: iconeTrigo,
};
const classesSelecaoPorTipo: Record<TipoRegistro, string> = {
  mortalidade: "bg-gema-bg border-gema text-gema-texto",
  venda: "bg-verde-claro border-verde text-verde",
  gasto: "bg-terra-bg border-terra text-terra",
};
const classesBadgePorTipo: Record<TipoRegistro, string> = {
  mortalidade: "bg-gema-bg text-gema-texto",
  venda: "bg-verde-claro text-verde",
  gasto: "bg-terra-bg text-terra",
};

const tipoPorRotuloFeed: Record<ItemFeed["tipo"], TipoRegistro> = {
  Mortalidade: "mortalidade",
  Venda: "venda",
  Gasto: "gasto",
};

interface DadosRegistro {
  lotes: LoteResponse[];
  /** Registros de hoje que já estão salvos na API — sobrevivem a recarregar a página. */
  hoje: ItemFeed[];
}

const REGISTRO_VAZIO: DadosRegistro = { lotes: [], hoje: [] };

/*
 * O "Registros de hoje" vem da API, não de um estado em memória: antes a lista sumia ao
 * trocar de tela ou recarregar, e o produtor não tinha como conferir se o registro da
 * manhã realmente entrou. Reusa o feed do painel, filtrado pelo dia de hoje.
 */
async function carregarDadosRegistro(): Promise<DadosRegistro> {
  const lotes = await listarTodosLotes();
  const { ano, mes } = anoMesAtual();
  const doMes = await carregarFeedRecente(lotes, ano, mes, 50);
  const hoje = hojeIso();
  return { lotes, hoje: doMes.filter((item) => item.data === hoje) };
}

export function RegistroPage() {
  const idLote = useId();
  const { notificarSucesso } = useNotificacao();

  const {
    dados: { lotes, hoje },
    carregando,
    erro: erroCarregamento,
    recarregar,
  } = useRecurso<DadosRegistro>(
    carregarDadosRegistro,
    REGISTRO_VAZIO,
    [],
    "Não foi possível carregar seus lotes. Verifique se a API está rodando.",
  );

  const [tipo, setTipo] = useState<TipoRegistro>("mortalidade");
  const [loteId, setLoteId] = useState("");
  const [data, setData] = useState(hojeIso());
  const [quantidade, setQuantidade] = useState(1);
  const [causa, setCausa] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState<ErroDeFormulario>(SEM_ERRO);

  // Mortalidade exige um lote. Enquanto o produtor não escolhe, usamos o primeiro —
  // sem isso o formulário sairia com loteId vazio e a API devolveria um 400 sem contexto.
  const loteEfetivo = tipo === "mortalidade" ? loteId || lotes[0]?.id || "" : loteId;
  // Lista vazia e falha de conexão são coisas diferentes: quem já tem lotes não pode ler
  // "cadastre um lote" só porque a API não respondeu.
  const falhouSemDados = Boolean(erroCarregamento) && lotes.length === 0;
  const semLotes = !carregando && !falhouSemDados && lotes.length === 0;

  function trocarTipo(novoTipo: TipoRegistro) {
    setTipo(novoTipo);
    setErroForm(SEM_ERRO);
    setQuantidade(1);
    setCausa("");
    setValor("");
    setCategoria("");
    setDescricao("");
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErroForm(SEM_ERRO);
    try {
      const nomeLote = lotes.find((lote) => lote.id === loteEfetivo)?.nome;
      if (tipo === "mortalidade") {
        await criarMortalidade({ loteId: loteEfetivo, data, quantidade, causa: causa || undefined });
        notificarSucesso(
          `${quantidade} ave${quantidade === 1 ? "" : "s"} registrada${quantidade === 1 ? "" : "s"}${
            nomeLote ? ` em ${nomeLote}` : ""
          } · ${formatarDataBR(data)}.`,
        );
        setQuantidade(1);
        setCausa("");
      } else {
        const tipoTransacao: TipoTransacao = tipo === "venda" ? "RECEITA" : "DESPESA";
        await criarTransacao({
          tipo: tipoTransacao,
          categoria,
          valor: Number(valor),
          data,
          loteId: loteEfetivo || undefined,
          descricao: descricao || undefined,
        });
        notificarSucesso(
          `${tipo === "venda" ? "Venda" : "Gasto"} de ${formatarMoeda(Number(valor))} em ${categoria} · ${formatarDataBR(data)}.`,
        );
        setValor("");
        setCategoria("");
        setDescricao("");
      }
      // Relê da API em vez de empilhar o item na mão: o que aparece na lista é o que
      // realmente foi salvo.
      recarregar();
    } catch (capturado) {
      setErroForm(lerErroDeFormulario(capturado, "Não foi possível salvar o registro."));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <CabecalhoPagina
        titulo="Novo registro"
        subtitulo="O dia a dia do seu galinheiro, registrado em menos de 30 segundos"
      />

      {erroCarregamento && (
        <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
          {erroCarregamento}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 items-start">
        <Card>
          {falhouSemDados ? (
            <p className="text-cinza text-[13.5px] text-center py-[26px]">
              Assim que a conexão voltar, o formulário aparece aqui.
            </p>
          ) : carregando ? (
            <>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-[70px] rounded-lg" />
                ))}
              </div>
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-[46px] w-full mb-4 rounded-lg" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-[46px] w-full mb-4 rounded-lg" />
              <Skeleton className="h-[44px] w-full rounded-lg" />
            </>
          ) : semLotes ? (
            <div className="flex flex-col items-center text-center gap-3 py-[26px]">
              <span className="text-cinza text-[13.5px]">
                Cadastre um lote primeiro — todo registro precisa saber de quais aves está falando.
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {(["mortalidade", "venda", "gasto"] as TipoRegistro[]).map((opcao) => (
                  <button
                    key={opcao}
                    type="button"
                    onClick={() => trocarTipo(opcao)}
                    aria-pressed={tipo === opcao}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border-[1.5px] cursor-pointer transition-colors ${
                      tipo === opcao ? classesSelecaoPorTipo[opcao] : "border-borda bg-white text-cinza hover:border-cinza-claro"
                    }`}
                  >
                    {iconePorTipo[opcao]}
                    <span className="text-[12.5px] font-medium">{rotuloTipo[opcao]}</span>
                  </button>
                ))}
              </div>

              {erroForm.mensagem && (
                <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
                  {erroForm.mensagem}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <CampoCustomizado rotulo="Lote" htmlFor={idLote} erro={erroForm.campos.loteId} className="mb-4">
                  <SeletorLote
                    id={idLote}
                    lotes={lotes}
                    value={loteEfetivo}
                    onChange={setLoteId}
                    opcaoVazia={tipo !== "mortalidade" ? "Sem lote (geral)" : undefined}
                    required={tipo === "mortalidade"}
                  />
                </CampoCustomizado>

                <CampoTexto
                  rotulo="Data"
                  type="date"
                  max={hojeIso()}
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  erro={erroForm.campos.data}
                  className="mb-4"
                  required
                />

                {tipo === "mortalidade" ? (
                  <>
                    <div className="mb-4">
                      <span className="block text-[13px] md:text-[12.5px] text-cinza font-medium mb-[5px]">Quantidade de aves</span>
                      <div className="flex items-center gap-[14px]">
                        <button
                          type="button"
                          onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                          aria-label="Diminuir quantidade"
                          className="w-[46px] h-[46px] rounded-[9px] border border-borda bg-white text-lg cursor-pointer"
                        >
                          −
                        </button>
                        <output className="font-heading text-[22px] font-semibold min-w-[34px] text-center">{quantidade}</output>
                        <button
                          type="button"
                          onClick={() => setQuantidade((q) => q + 1)}
                          aria-label="Aumentar quantidade"
                          className="w-[46px] h-[46px] rounded-[9px] border border-borda bg-white text-lg cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      {erroForm.campos.quantidade && (
                        <p className="text-[12px] text-terra mt-1">{erroForm.campos.quantidade}</p>
                      )}
                    </div>
                    <CampoTexto
                      rotulo="Causa (opcional)"
                      value={causa}
                      onChange={(e) => setCausa(e.target.value)}
                      placeholder="Ex: doença respiratória"
                      erro={erroForm.campos.causa}
                      className="mb-5"
                    />
                  </>
                ) : (
                  <>
                    <CampoTexto
                      rotulo={tipo === "venda" ? "Valor da venda (R$)" : "Valor do gasto (R$)"}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="0,00"
                      erro={erroForm.campos.valor}
                      className="mb-4"
                      required
                    />
                    <CampoTexto
                      rotulo="Categoria"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      placeholder={tipo === "venda" ? "Venda de ovos" : "Ração"}
                      erro={erroForm.campos.categoria}
                      className="mb-4"
                      required
                    />
                    <CampoTexto
                      rotulo={tipo === "venda" ? "Comprador (opcional)" : "Observação (opcional)"}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder={tipo === "venda" ? "Ex: feira do centro" : "Ex: 20 sacos"}
                      erro={erroForm.campos.descricao}
                      className="mb-5"
                    />
                  </>
                )}

                <Botao type="submit" variante="primary" disabled={salvando} className="w-full">
                  {salvando ? "Salvando..." : "Salvar registro"}
                </Botao>
              </form>
            </>
          )}
        </Card>

        <Card>
          <div className="text-[15px] font-semibold mb-3">Registros de hoje</div>
          {carregando ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="py-[9px]">
                <Skeleton className="h-3 w-full" />
              </div>
            ))
          ) : hoje.length === 0 ? (
            <div className="flex flex-col items-center text-center py-[26px]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-10 h-10 text-cinza-tenue/60 mb-2">
                <path d="M12 2C8 2 4 10.5 4 15.5a8 8 0 0 0 16 0C20 10.5 16 2 12 2Z" />
              </svg>
              <p className="text-cinza-claro text-[13px]">
                Nenhum registro ainda hoje.
                <br />O primeiro leva só alguns toques.
              </p>
            </div>
          ) : (
            hoje.map((item, indice) => {
              const tipoItem = tipoPorRotuloFeed[item.tipo];
              return (
                <div key={indice} className="flex items-center gap-3 py-[9px] border-b border-[#F0EBDD] last:border-b-0 text-[13px]">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${classesBadgePorTipo[tipoItem]}`}>
                    {iconePorTipo[tipoItem]}
                  </span>
                  <span className="flex-1 min-w-0 truncate">
                    <strong>{item.tipo}</strong> · {item.loteNome}
                  </span>
                  <span className="flex-shrink-0 text-cinza">{item.detalhe}</span>
                </div>
              );
            })
          )}
        </Card>
      </div>
    </div>
  );
}
