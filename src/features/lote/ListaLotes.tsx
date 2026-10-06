import { Badge } from "../../shared/components/Badge";
import { Botao } from "../../shared/components/Botao";
import { AcoesTabela } from "../../shared/components/BotaoIcone";
import { LINHA_NO_MOBILE, LISTA_NO_MOBILE } from "../../shared/components/PainelTabela";
import { formatarNumero } from "../../shared/format";
import type { LoteResponse } from "./types";
import type { VacinacaoResponse } from "../vacinacao/types";

type StatusSanitario = "ok" | "warn" | "bad";

interface ListaLotesProps {
  lotes: LoteResponse[];
  pendentes: VacinacaoResponse[];
  aoEditar: (lote: LoteResponse) => void;
  aoEncerrar: (lote: LoteResponse) => void;
}

function statusSanitario(loteId: string, pendentes: VacinacaoResponse[]): StatusSanitario {
  const doLote = pendentes.filter((v) => v.loteId === loteId);
  if (doLote.some((v) => v.status === "Atrasada")) return "bad";
  if (doLote.some((v) => v.status === "Próxima")) return "warn";
  return "ok";
}

function rotuloStatus(status: StatusSanitario): string {
  if (status === "bad") return "Vacina atrasada";
  if (status === "warn") return "Vacina próxima";
  return "Em dia";
}

function rotuloStatusCompacto(status: StatusSanitario): string {
  if (status === "bad") return "Atrasada";
  if (status === "warn") return "Próxima";
  return "Em dia";
}

function NomeDoLote({ lote }: { lote: LoteResponse }) {
  if (lote.ativo) return <>{lote.nome}</>;

  return (
    <>
      <span className="line-through text-cinza">{lote.nome}</span>
      <Badge tom="neutro" className="ml-2 align-middle">
        Encerrado
      </Badge>
    </>
  );
}

function rotuloSemanas(semanas: number): string {
  return `${semanas} semana${semanas === 1 ? "" : "s"}`;
}

export function ListaLotes({ lotes, pendentes, aoEditar, aoEncerrar }: ListaLotesProps) {
  return (
    <>
      <div className={LISTA_NO_MOBILE}>
        {lotes.map((lote) => {
          const status = statusSanitario(lote.id, pendentes);
          return (
            <div key={lote.id} className={LINHA_NO_MOBILE}>
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="font-semibold text-[14px] min-w-0">
                  <NomeDoLote lote={lote} />
                </div>
                <Badge className="flex-shrink-0" tom={status}>
                  {rotuloStatus(status)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-y-1 text-[13px] text-cinza mb-3">
                <div>
                  <span className="text-cinza-claro">Aves: </span>
                  {formatarNumero(lote.avesVivas)}
                </div>
                <div>
                  <span className="text-cinza-claro">Idade: </span>
                  {rotuloSemanas(lote.idadeSemanas)}
                </div>
                <div>
                  <span className="text-cinza-claro">Fase: </span>
                  {lote.fase}
                </div>
                <div>
                  <span className="text-cinza-claro">Raça: </span>
                  {lote.raca || "—"}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Botao onClick={() => aoEditar(lote)}>Editar</Botao>
                {lote.ativo && <Botao onClick={() => aoEncerrar(lote)}>Encerrar</Botao>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr>
              <th className="text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Lote
              </th>
              <th className="w-[80px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Aves
              </th>
              <th className="w-[110px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Idade
              </th>
              <th className="w-[140px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Fase
              </th>
              <th className="w-[150px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Raça
              </th>
              <th className="w-[120px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Status
              </th>
              <th className="w-[96px] px-3 py-[10px] border-b border-borda">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => {
              const status = statusSanitario(lote.id, pendentes);
              return (
                <tr key={lote.id} className="hover:bg-[#FBF8F0]">
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] font-semibold truncate" title={lote.nome}>
                    <NomeDoLote lote={lote} />
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] whitespace-nowrap">
                    {formatarNumero(lote.avesVivas)}
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] whitespace-nowrap">
                    {rotuloSemanas(lote.idadeSemanas)}
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={lote.fase}>
                    {lote.fase}
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate" title={lote.raca || undefined}>
                    {lote.raca || "—"}
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px]">
                    <Badge tom={status}>{rotuloStatusCompacto(status)}</Badge>
                  </td>
                  <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px]">
                    <AcoesTabela
                      aoEditar={() => aoEditar(lote)}
                      aoExcluir={lote.ativo ? () => aoEncerrar(lote) : undefined}
                      rotuloEditar={`Editar ${lote.nome}`}
                      rotuloExcluir={`Encerrar ${lote.nome}`}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
