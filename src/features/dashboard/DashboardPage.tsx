import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Botao } from "../../shared/components/Botao";
import { BotaoVisibilidade } from "../../shared/components/BotaoVisibilidade";
import { CabecalhoPagina } from "../../shared/components/CabecalhoPagina";
import { Card } from "../../shared/components/Card";
import { MetricCard } from "../../shared/components/MetricCard";
import { Badge } from "../../shared/components/Badge";
import { SeletorMes } from "../../shared/components/SeletorMes";
import { Skeleton } from "../../shared/components/Skeleton";
import { useRecurso } from "../../shared/hooks/useRecurso";
import { useValoresVisiveis } from "../../shared/hooks/useValoresVisiveis";
import { anoMesAtual, formatarDataBR, formatarMoeda, formatarNumero, saudacaoPorHorario } from "../../shared/format";
import { CAMINHOS } from "../../shared/navegacao";
import { useAuth } from "../auth/useAuth";
import { listarTodosLotes } from "../lote/api";
import type { LoteResponse } from "../lote/types";
import { listarVacinacoesPendentes } from "../vacinacao/api";
import { rotuloVacina, tomVacina } from "../vacinacao/status";
import type { VacinacaoResponse } from "../vacinacao/types";
import { obterResumo } from "./api";
import type { ResumoResponse } from "./types";
import { carregarFeedRecente, type ItemFeed } from "./feed";

interface DadosPainel {
  resumo: ResumoResponse | null;
  lotes: LoteResponse[];
  pendentes: VacinacaoResponse[];
  feed: ItemFeed[];
}

const PAINEL_VAZIO: DadosPainel = { resumo: null, lotes: [], pendentes: [], feed: [] };

async function carregarPainel(ano: number, mes: number): Promise<DadosPainel> {
  const [resumo, lotes, pendentes] = await Promise.all([
    obterResumo(ano, mes),
    listarTodosLotes(),
    listarVacinacoesPendentes(),
  ]);
  return { resumo, lotes, pendentes, feed: await carregarFeedRecente(lotes, ano, mes) };
}

export function DashboardPage() {
  const { sessao } = useAuth();
  const navegar = useNavigate();
  const [{ ano, mes }, setAnoMes] = useState(anoMesAtual());
  const { visivel, alternar: alternarVisibilidade, controlavel: mostrarBotaoVisibilidade } = useValoresVisiveis();

  const {
    dados: { resumo, lotes, pendentes, feed },
    carregando,
    erro,
  } = useRecurso<DadosPainel>(
    () => carregarPainel(ano, mes),
    PAINEL_VAZIO,
    [ano, mes],
    "Não foi possível carregar o painel. Verifique se a API está rodando.",
  );

  const mapaNomesLote = new Map(lotes.map((lote) => [lote.id, lote.nome]));

  return (
    <div>
      <CabecalhoPagina
        titulo={`${saudacaoPorHorario()}, ${sessao?.nome ?? ""}`}
        subtitulo={<SeletorMes ano={ano} mes={mes} onChange={setAnoMes} escuro />}
        acao={
          <div className="flex items-center gap-[10px] w-full sm:w-auto">
            {mostrarBotaoVisibilidade && <BotaoVisibilidade visivel={visivel} onClick={alternarVisibilidade} escuro />}
            <Botao variante="inverso" onClick={() => navegar(CAMINHOS.registro)} className="flex-1 sm:flex-none">
              + Novo registro
            </Botao>
          </div>
        }
      />

      {erro && (
        <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
          {erro}
        </div>
      )}

      {erro && !resumo ? null : carregando ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-7 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mt-4 items-start">
            <div>
              <Skeleton className="h-4 w-32 mt-6 mb-3" />
              <div className="bg-white border border-borda rounded-app px-[14px] py-[10px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 py-[10px]">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-28 mt-6 mb-3" />
              <Card className="px-5 py-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="py-[9px]">
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            <MetricCard
              label="Lucro do período"
              value={formatarMoeda(resumo?.lucroDoPeriodo ?? 0)}
              hint="receitas − despesas do período selecionado"
              tom={(resumo?.lucroDoPeriodo ?? 0) >= 0 ? "pos" : "neg"}
              oculto={!visivel}
            />
            <MetricCard
              label="Mortalidade do período"
              value={`${formatarNumero(resumo?.mortalidadeDoPeriodo ?? 0)} ave${resumo?.mortalidadeDoPeriodo === 1 ? "" : "s"}`}
              hint="total de aves perdidas no período selecionado"
              oculto={!visivel}
            />
            <MetricCard
              label={
                <>
                  Aves ativas
                  <span className="text-[10px] text-cinza-claro font-normal uppercase tracking-wide">· hoje</span>
                </>
              }
              value={formatarNumero(resumo?.avesAtivas ?? 0)}
              hint={`em ${formatarNumero(lotes.length)} lote${lotes.length === 1 ? "" : "s"} — não muda com o período acima`}
              oculto={!visivel}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mt-4 items-start">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold mt-6 mb-3 flex justify-between items-center">
                <span>Últimos registros</span>
                <Botao className="text-xs" onClick={() => navegar(CAMINHOS.registro)}>
                  registrar
                </Botao>
              </div>
              {feed.length === 0 ? (
                <div className="bg-white border border-borda rounded-app text-center text-cinza-claro text-[13px] py-[30px]">
                  Nenhum registro nesse período.
                </div>
              ) : (
                <>
                  {/* Cards empilhados no mobile */}
                  <div className="flex flex-col gap-3 md:hidden">
                    {feed.map((item, indice) => (
                      <Card key={indice}>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <div className="font-semibold text-[13.5px] truncate min-w-0">{item.loteNome}</div>
                          <div className="text-[11px] text-cinza-claro flex-shrink-0">{formatarDataBR(item.data)}</div>
                        </div>
                        <div className="text-[12px] text-cinza truncate">
                          {item.tipo} · {item.detalhe}
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Tabela a partir do tablet — layout fixo + truncamento: nunca precisa de scroll lateral */}
                  <div className="hidden md:block bg-white border border-borda rounded-app overflow-hidden">
                    <table className="w-full border-collapse table-fixed">
                      <thead>
                        <tr>
                          <th className="w-[120px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                            Data
                          </th>
                          <th className="w-[120px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                            Tipo
                          </th>
                          <th className="w-[160px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                            Lote
                          </th>
                          <th className="text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                            Detalhe
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {feed.map((item, indice) => (
                          <tr key={indice} className="hover:bg-[#FBF8F0]">
                            <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] whitespace-nowrap">
                              {formatarDataBR(item.data)}
                            </td>
                            <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate">{item.tipo}</td>
                            <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={item.loteNome}>
                              {item.loteNome}
                            </td>
                            <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={item.detalhe}>
                              {item.detalhe}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div className="min-w-0">
              <div className="text-[15px] font-semibold mt-6 mb-3 flex justify-between items-center">
                <span>
                  Próximas vacinas{" "}
                  <span className="text-[10px] text-cinza-claro font-normal uppercase tracking-wide">· hoje</span>
                </span>
                <Botao className="text-xs" onClick={() => navegar(CAMINHOS.vacinas)}>
                  ver todas
                </Botao>
              </div>
              <Card className="px-5 py-2">
                {pendentes.length === 0 ? (
                  <p className="text-center text-cinza-claro text-[13px] py-[30px]">Nenhuma vacina pendente.</p>
                ) : (
                  <>
                    {pendentes.slice(0, 3).map((vacina) => (
                      <div key={vacina.id} className="flex justify-between items-start gap-2 py-[9px] border-b border-[#F0EBDD] last:border-b-0">
                        <span className="min-w-0 truncate">
                          <strong>{mapaNomesLote.get(vacina.loteId) ?? "Lote"}</strong> · {vacina.tipoVacinaNome || "Vacina"}
                          <div className="text-[11px] text-cinza-claro">{formatarDataBR(vacina.dataPrevista)}</div>
                        </span>
                        <Badge className="flex-shrink-0" tom={tomVacina(vacina.status)}>
                          {rotuloVacina(vacina.status)}
                        </Badge>
                      </div>
                    ))}
                    {pendentes.length > 3 && (
                      <button
                        type="button"
                        onClick={() => navegar(CAMINHOS.vacinas)}
                        className="w-full text-center text-[12px] text-cinza py-[9px] cursor-pointer hover:text-tinta"
                      >
                        +{pendentes.length - 3} pendente{pendentes.length - 3 === 1 ? "" : "s"}
                      </button>
                    )}
                  </>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
