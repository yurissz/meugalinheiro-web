import { useState, type FormEvent } from "react";
import { FormularioEmOverlay } from "../../shared/components/overlay/FormularioEmOverlay";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../shared/api/errosFormulario";
import { atualizarLote, criarLote } from "./api";
import { FormularioLote } from "./FormularioLote";
import { dadosDoLote, mesmosDadosDeLote } from "./loteFormulario";
import type { LoteRequest, LoteResponse } from "./types";

interface LoteEmOverlayProps {
  /** `null` cadastra um lote novo; um lote edita aquele lote. */
  lote: LoteResponse | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}

/**
 * A edição não busca o lote na API: a linha da listagem já traz o LoteResponse completo,
 * então o overlay abre com os campos preenchidos na hora, sem requisição nem skeleton.
 */
export function LoteEmOverlay({ lote, aoFechar, aoSalvar }: LoteEmOverlayProps) {
  const { notificarSucesso } = useNotificacao();
  const iniciais = dadosDoLote(lote);

  const [valores, setValores] = useState(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  const editando = lote !== null;
  const temAlteracoes = !mesmosDadosDeLote(valores, iniciais);

  async function handleEnviar(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErro(SEM_ERRO);

    const dados: LoteRequest = {
      nome: valores.nome,
      dataEntrada: valores.dataEntrada,
      quantidadeInicial: Number(valores.quantidadeInicial),
      raca: valores.raca || undefined,
    };

    try {
      if (lote) {
        await atualizarLote(lote.id, dados);
        notificarSucesso(`Lote ${dados.nome} atualizado.`);
      } else {
        await criarLote(dados);
        notificarSucesso(`Lote ${dados.nome} cadastrado com ${dados.quantidadeInicial} aves.`);
      }
      aoSalvar();
      aoFechar();
    } catch (capturado) {
      setErro(lerErroDeFormulario(capturado, "Não foi possível salvar o lote."));
      setSalvando(false);
    }
  }

  return (
    <FormularioEmOverlay
      titulo={editando ? "Editar lote" : "Novo lote"}
      descricao={editando ? "Ajuste os dados deste lote" : "Um lote agrupa aves da mesma idade"}
      temAlteracoes={temAlteracoes}
      aoFechar={aoFechar}
    >
      <FormularioLote
        valores={valores}
        erro={erro}
        salvando={salvando}
        textoConfirmar={editando ? "Salvar alterações" : "Cadastrar lote"}
        aoMudar={setValores}
        aoEnviar={handleEnviar}
      />
    </FormularioEmOverlay>
  );
}
