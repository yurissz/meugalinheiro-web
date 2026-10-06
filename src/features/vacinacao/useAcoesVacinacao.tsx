import { useState } from "react";
import { useConfirmacao } from "../../shared/components/useConfirmacao";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerMensagemDeErro } from "../../shared/api/errosFormulario";
import { formatarDataBR } from "../../shared/format";
import { desmarcarVacinacaoAplicada, excluirVacinacao, marcarVacinacaoAplicada } from "./api";
import type { VacinacaoComLote } from "./types";

export function useAcoesVacinacao(aoMudar: () => void) {
  const { confirmar, dialogo } = useConfirmacao();
  const { notificarSucesso, notificarErro } = useNotificacao();
  const [aplicandoId, setAplicandoId] = useState<string | null>(null);

  async function desfazerAplicacao(vacinacao: VacinacaoComLote) {
    const nome = vacinacao.tipoVacinaNome || "Vacina";
    try {
      await desmarcarVacinacaoAplicada(vacinacao.id, {
        tipoVacinaId: vacinacao.tipoVacinaId,
        dataPrevista: vacinacao.dataPrevista,
      });
      notificarSucesso(`${nome} voltou para a lista de pendentes.`);
      aoMudar();
    } catch (capturado) {
      notificarErro(lerMensagemDeErro(capturado, `Não foi possível desfazer a aplicação de ${nome}.`));
    }
  }

  async function aplicar(vacinacao: VacinacaoComLote) {
    const nome = vacinacao.tipoVacinaNome || "Vacina";
    setAplicandoId(vacinacao.id);
    try {
      await marcarVacinacaoAplicada(vacinacao.id);
      notificarSucesso(`${nome} aplicada hoje em ${vacinacao.loteNome}.`, {
        rotulo: "Desfazer",
        aoAcionar: () => void desfazerAplicacao(vacinacao),
      });
      aoMudar();
    } catch (capturado) {
      notificarErro(lerMensagemDeErro(capturado, `Não foi possível marcar ${nome} como aplicada.`));
    } finally {
      setAplicandoId(null);
    }
  }

  async function excluir(vacinacao: VacinacaoComLote) {
    const nome = vacinacao.tipoVacinaNome || "Vacina";
    const confirmado = await confirmar({
      titulo: "Excluir vacinação",
      mensagem: (
        <>
          A aplicação de <strong>{nome}</strong> do lote <strong>{vacinacao.loteNome}</strong>, prevista para{" "}
          {formatarDataBR(vacinacao.dataPrevista)}, será apagada.
        </>
      ),
      textoConfirmar: "Excluir",
      destrutivo: true,
    });
    if (!confirmado) return;

    try {
      await excluirVacinacao(vacinacao.id);
      notificarSucesso(`${nome} removida.`);
      aoMudar();
    } catch (capturado) {
      notificarErro(lerMensagemDeErro(capturado, "Não foi possível excluir a vacinação."));
    }
  }

  return { aplicandoId, aplicar, excluir, dialogo };
}
