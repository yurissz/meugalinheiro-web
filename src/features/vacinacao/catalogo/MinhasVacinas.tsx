import { Botao } from "../../../shared/components/Botao";
import { MenuAcoes, type ItemMenuAcoes } from "../../../shared/components/MenuAcoes";
import { iconeEditar, iconeExcluir } from "../../../shared/icons";
import type { TipoVacinaResponse } from "../../tipoVacina/types";
import { SecaoRecolhivel } from "../lista/SecaoRecolhivel";

interface MinhasVacinasProps {
  tiposVacina: TipoVacinaResponse[];
  aoCadastrar: () => void;
  aoEditar: (tipo: TipoVacinaResponse) => void;
  aoArquivar: (tipo: TipoVacinaResponse) => void;
}

export function MinhasVacinas({ tiposVacina, aoCadastrar, aoEditar, aoArquivar }: MinhasVacinasProps) {
  return (
    <SecaoRecolhivel
      titulo="Minhas vacinas"
      quantidade={tiposVacina.length}
      tom="ok"
      abertaInicialmente={false}
      vazio="Você ainda não cadastrou nenhuma vacina. Elas também podem ser cadastradas na hora de programar."
      rodape={
        <Botao variante="primary" onClick={aoCadastrar} className="w-full sm:w-auto">
          + Cadastrar vacina
        </Botao>
      }
    >
      {tiposVacina.map((tipo) => {
        const itensDoMenu: ItemMenuAcoes[] = [
          { rotulo: "Editar", icone: iconeEditar, aoEscolher: () => aoEditar(tipo) },
          { rotulo: "Arquivar", icone: iconeExcluir, destrutivo: true, aoEscolher: () => aoArquivar(tipo) },
        ];

        return (
          <li
            key={tipo.id}
            className="flex justify-between items-center gap-2 px-[14px] py-3 border-b border-[#F0EBDD] last:border-b-0"
          >
            <span className="min-w-0">
              <strong className="block truncate text-[15px] md:text-[14px]">{tipo.nome}</strong>
              <span className="text-[12.5px] text-cinza">
                {tipo.idadeSemanasRecomendada != null
                  ? `Recomendada às ${tipo.idadeSemanasRecomendada} semanas`
                  : "Sem idade recomendada"}
              </span>
            </span>
            <MenuAcoes rotulo={`Mais ações para ${tipo.nome}`} itens={itensDoMenu} />
          </li>
        );
      })}
    </SecaoRecolhivel>
  );
}
