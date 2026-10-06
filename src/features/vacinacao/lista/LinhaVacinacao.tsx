import { Botao } from "../../../shared/components/Botao";
import { MenuAcoes, type ItemMenuAcoes } from "../../../shared/components/MenuAcoes";
import { iconeEditar, iconeExcluir } from "../../../shared/icons";
import { textoDePrazo } from "../prazo";
import { tomVacina } from "../status";
import type { VacinacaoComLote } from "../types";

interface LinhaVacinacaoProps {
  vacinacao: VacinacaoComLote;
  hoje: string;
  mostrarLote: boolean;
  aplicando: boolean;
  aoAplicar?: (vacinacao: VacinacaoComLote) => void;
  aoEditar: (vacinacao: VacinacaoComLote) => void;
  aoExcluir: (vacinacao: VacinacaoComLote) => void;
}

const classesBarraPorTom: Record<"ok" | "warn" | "bad", string> = {
  ok: "bg-verde",
  warn: "bg-gema",
  bad: "bg-terra",
};

const classesPrazoPorTom: Record<"ok" | "warn" | "bad", string> = {
  ok: "text-cinza",
  warn: "text-gema-texto font-semibold",
  bad: "text-terra font-semibold",
};

export function LinhaVacinacao({
  vacinacao,
  hoje,
  mostrarLote,
  aplicando,
  aoAplicar,
  aoEditar,
  aoExcluir,
}: LinhaVacinacaoProps) {
  const nome = vacinacao.tipoVacinaNome || "Vacina";
  const tom = tomVacina(vacinacao.status);

  const itensDoMenu: ItemMenuAcoes[] = [
    { rotulo: "Editar", icone: iconeEditar, aoEscolher: () => aoEditar(vacinacao) },
    { rotulo: "Excluir", icone: iconeExcluir, destrutivo: true, aoEscolher: () => aoExcluir(vacinacao) },
  ];

  return (
    <li className="relative flex flex-wrap items-center gap-x-3 gap-y-2 pl-[18px] pr-[10px] py-3 border-b border-[#F0EBDD] last:border-b-0">
      <span aria-hidden="true" className={`absolute left-0 top-0 bottom-0 w-[5px] ${classesBarraPorTom[tom]}`} />

      <div className="min-w-0 flex-1 basis-[160px]">
        <div className="font-semibold text-[15px] md:text-[14px] truncate" title={nome}>
          {nome}
        </div>
        <div className="text-[12.5px] leading-snug">
          {mostrarLote && <span className="text-cinza">{vacinacao.loteNome} · </span>}
          <span className={classesPrazoPorTom[tom]}>{textoDePrazo(vacinacao, hoje)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
        {aoAplicar && (
          <Botao
            variante="primary"
            className="px-4 font-semibold"
            disabled={aplicando}
            onClick={() => aoAplicar(vacinacao)}
          >
            {aplicando ? "Salvando..." : "Apliquei"}
          </Botao>
        )}
        <MenuAcoes rotulo={`Mais ações para ${nome}`} itens={itensDoMenu} />
      </div>
    </li>
  );
}
