import { Botao } from "../../shared/components/Botao";
import { AcoesTabela } from "../../shared/components/BotaoIcone";
import { LINHA_NO_MOBILE, LISTA_NO_MOBILE } from "../../shared/components/PainelTabela";
import { formatarDataBR, formatarNumero } from "../../shared/format";
import type { MortalidadeResponse } from "./types";

interface ListaMortalidadeProps {
  registros: MortalidadeResponse[];
  nomeDoLote?: (loteId: string) => string;
  aoEditar: (registro: MortalidadeResponse) => void;
  aoExcluir: (registro: MortalidadeResponse) => void;
}

function rotuloAves(quantidade: number): string {
  return `${formatarNumero(quantidade)} ave${quantidade === 1 ? "" : "s"}`;
}

export function ListaMortalidade({ registros, nomeDoLote, aoEditar, aoExcluir }: ListaMortalidadeProps) {
  const mostraLote = nomeDoLote !== undefined;

  return (
    <>
      <div className={LISTA_NO_MOBILE}>
        {registros.map((registro) => (
          <div key={registro.id} className={LINHA_NO_MOBILE}>
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="font-semibold text-[14px]">{rotuloAves(registro.quantidade)}</div>
              <div className="text-[12px] text-cinza-claro flex-shrink-0 whitespace-nowrap">
                {formatarDataBR(registro.data)}
              </div>
            </div>
            {mostraLote && (
              <div className="text-[13px] text-cinza mb-1">
                <span className="text-cinza-claro">Lote: </span>
                {nomeDoLote(registro.loteId)}
              </div>
            )}
            <div className="text-[13px] text-cinza mb-3">
              <span className="text-cinza-claro">Causa: </span>
              {registro.causa || "não informada"}
            </div>
            <div className="flex flex-wrap gap-2">
              <Botao onClick={() => aoEditar(registro)}>Editar</Botao>
              <Botao onClick={() => aoExcluir(registro)}>Excluir</Botao>
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
              <th className="w-[90px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Aves
              </th>
              {mostraLote && (
                <th className="w-[170px] text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                  Lote
                </th>
              )}
              <th className="text-left text-[11.5px] text-cinza font-medium uppercase tracking-wide px-3 py-[10px] border-b border-borda">
                Causa
              </th>
              <th className="w-[96px] px-3 py-[10px] border-b border-borda">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className="hover:bg-[#FBF8F0]">
                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] whitespace-nowrap">
                  {formatarDataBR(registro.data)}
                </td>
                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] font-semibold whitespace-nowrap">
                  {formatarNumero(registro.quantidade)}
                </td>
                {mostraLote && (
                  <td
                    className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate"
                    title={nomeDoLote(registro.loteId)}
                  >
                    {nomeDoLote(registro.loteId)}
                  </td>
                )}
                <td
                  className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px] truncate"
                  title={registro.causa || undefined}
                >
                  {registro.causa || <span className="text-cinza-claro">não informada</span>}
                </td>
                <td className="px-3 py-[13px] border-b border-[#F0EBDD] text-[13.5px]">
                  <AcoesTabela aoEditar={() => aoEditar(registro)} aoExcluir={() => aoExcluir(registro)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
