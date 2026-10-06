import { useState, type FormEvent } from "react";
import { FormularioEmOverlay } from "../../shared/components/overlay/FormularioEmOverlay";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../shared/api/errosFormulario";
import { formatarMoeda } from "../../shared/format";
import type { LoteResponse } from "../lote/types";
import { atualizarTransacao, criarTransacao } from "./api";
import { FormularioTransacao } from "./FormularioTransacao";
import { dadosDaTransacao, mesmosDadosDeTransacao } from "./transacaoFormulario";
import type { TransacaoRequest, TransacaoResponse } from "./types";

interface TransacaoEmOverlayProps {
  lotes: LoteResponse[];
  /** `null` lança uma movimentação nova; uma transação edita aquele lançamento. */
  transacao: TransacaoResponse | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export function TransacaoEmOverlay({ lotes, transacao, aoFechar, aoSalvar }: TransacaoEmOverlayProps) {
  const { notificarSucesso } = useNotificacao();
  const iniciais = dadosDaTransacao(transacao);

  const [valores, setValores] = useState(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  const editando = transacao !== null;
  const temAlteracoes = !mesmosDadosDeTransacao(valores, iniciais);

  async function handleEnviar(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErro(SEM_ERRO);

    const dados: TransacaoRequest = {
      tipo: valores.tipo,
      categoria: valores.categoria,
      valor: Number(valores.valor),
      data: valores.data,
      loteId: valores.loteId || undefined,
      descricao: valores.descricao || undefined,
    };

    try {
      if (transacao) {
        await atualizarTransacao(transacao.id, dados);
        notificarSucesso(`${dados.categoria} atualizada para ${formatarMoeda(dados.valor)}.`);
      } else {
        await criarTransacao(dados);
        const rotulo = dados.tipo === "RECEITA" ? "Venda" : "Gasto";
        notificarSucesso(`${rotulo} de ${formatarMoeda(dados.valor)} em ${dados.categoria} lançada.`);
      }
      aoSalvar();
      aoFechar();
    } catch (capturado) {
      setErro(lerErroDeFormulario(capturado, "Não foi possível salvar a movimentação."));
      setSalvando(false);
    }
  }

  return (
    <FormularioEmOverlay
      titulo={editando ? "Editar movimentação" : "Venda ou gasto"}
      descricao="Só da criação, separado do dinheiro de casa."
      temAlteracoes={temAlteracoes}
      aoFechar={aoFechar}
    >
      <FormularioTransacao
        lotes={lotes}
        valores={valores}
        erro={erro}
        salvando={salvando}
        textoConfirmar={editando ? "Salvar" : "Lançar"}
        aoMudar={setValores}
        aoEnviar={handleEnviar}
      />
    </FormularioEmOverlay>
  );
}
