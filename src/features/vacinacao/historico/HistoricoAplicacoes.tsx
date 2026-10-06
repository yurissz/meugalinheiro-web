import { Paginacao } from "../../../shared/components/Paginacao";
import { usePaginacao } from "../../../shared/hooks/usePaginacao";
import type { LoteResponse } from "../../lote/types";
import { listarVacinacoes } from "../api";
import { LinhaVacinacao } from "../lista/LinhaVacinacao";
import { SecaoRecolhivel } from "../lista/SecaoRecolhivel";
import { comDadosDoLote } from "../pendencias";
import type { VacinacaoComLote } from "../types";

const POR_PAGINA = 10;

interface HistoricoAplicacoesProps {
  lotes: LoteResponse[];
  loteId: string;
  hoje: string;
  versao: number;
  aoEditar: (vacinacao: VacinacaoComLote) => void;
  aoExcluir: (vacinacao: VacinacaoComLote) => void;
}

export function HistoricoAplicacoes({
  lotes,
  loteId,
  hoje,
  versao,
  aoEditar,
  aoExcluir,
}: HistoricoAplicacoesProps) {
  const { itens, pagina, totalPaginas, totalElementos, carregando, erro, paginaAnterior, proximaPagina, primeiraPagina, ultimaPagina } =
    usePaginacao(
      (paginaAtual, tamanho) => listarVacinacoes(paginaAtual, tamanho, { aplicada: true, loteId: loteId || undefined }),
      POR_PAGINA,
      [loteId, versao],
      "Não foi possível carregar as vacinas já aplicadas.",
    );

  const aplicadas = comDadosDoLote(itens, lotes);

  return (
    <>
      <SecaoRecolhivel
        titulo="Já aplicadas"
        quantidade={totalElementos}
        tom="ok"
        abertaInicialmente={false}
        vazio={erro ?? "Nenhuma vacina aplicada ainda."}
      >
        {aplicadas.map((vacinacao) => (
          <LinhaVacinacao
            key={vacinacao.id}
            vacinacao={vacinacao}
            hoje={hoje}
            mostrarLote={!loteId}
            aplicando={false}
            aoEditar={aoEditar}
            aoExcluir={aoExcluir}
          />
        ))}
      </SecaoRecolhivel>

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
    </>
  );
}
