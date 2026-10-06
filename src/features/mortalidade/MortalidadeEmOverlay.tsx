import { useId, useState, type FormEvent } from "react";
import { CampoCustomizado } from "../../shared/components/Campo";
import { FormularioEmOverlay } from "../../shared/components/overlay/FormularioEmOverlay";
import { useNotificacao } from "../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../shared/api/errosFormulario";
import { formatarDataBR } from "../../shared/format";
import { SeletorLote } from "../lote/SeletorLote";
import type { LoteResponse } from "../lote/types";
import { atualizarMortalidade, criarMortalidade } from "./api";
import { FormularioMortalidade } from "./FormularioMortalidade";
import { dadosDaMortalidade, mesmosDadosDeMortalidade } from "./mortalidadeFormulario";
import type { MortalidadeResponse } from "./types";

interface MortalidadeEmOverlayProps {
  lotes: LoteResponse[];
  /** Pré-seleção quando o modal abre a partir de um lote; vazio abre sem lote escolhido. */
  loteInicialId?: string;
  /** `null` registra uma perda nova; um registro edita aquele registro. */
  registro: MortalidadeResponse | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}

function plural(quantidade: number): string {
  return quantidade === 1 ? "" : "s";
}

export function MortalidadeEmOverlay({
  lotes,
  loteInicialId = "",
  registro,
  aoFechar,
  aoSalvar,
}: MortalidadeEmOverlayProps) {
  const { notificarSucesso } = useNotificacao();
  const idLote = useId();
  const iniciais = dadosDaMortalidade(registro, loteInicialId);

  const [valores, setValores] = useState(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  const editando = registro !== null;
  const temAlteracoes = !mesmosDadosDeMortalidade(valores, iniciais);
  const lote = lotes.find((item) => item.id === valores.loteId);

  function erroDeRegraLocal(quantidade: number): ErroDeFormulario | null {
    if (!lote) {
      return { mensagem: "", campos: { loteId: "Escolha o lote onde a perda aconteceu." } };
    }

    if (valores.data < lote.dataEntrada) {
      return {
        mensagem: "",
        campos: { data: `O lote entrou em ${formatarDataBR(lote.dataEntrada)} — escolha uma data a partir daí.` },
      };
    }

    const creditoDaEdicao = registro?.loteId === lote.id ? (registro?.quantidade ?? 0) : 0;
    const disponiveis = lote.avesVivas + creditoDaEdicao;
    if (quantidade > disponiveis) {
      return {
        mensagem: "",
        campos: { quantidade: `O lote tem ${disponiveis} ave${plural(disponiveis)} viva${plural(disponiveis)}.` },
      };
    }

    return null;
  }

  async function handleEnviar(evento: FormEvent) {
    evento.preventDefault();
    const quantidade = Number(valores.quantidade);

    const erroLocal = erroDeRegraLocal(quantidade);
    if (erroLocal) {
      setErro(erroLocal);
      return;
    }

    setSalvando(true);
    setErro(SEM_ERRO);
    const dados = { data: valores.data, quantidade, causa: valores.causa || undefined };

    try {
      if (registro) {
        await atualizarMortalidade(registro.id, dados);
        notificarSucesso(`Registro atualizado para ${quantidade} ave${plural(quantidade)}.`);
      } else {
        await criarMortalidade({ loteId: valores.loteId, ...dados });
        notificarSucesso(`${quantidade} ave${plural(quantidade)} registrada${plural(quantidade)} em ${lote?.nome}.`);
      }
      aoSalvar();
      aoFechar();
    } catch (capturado) {
      setErro(lerErroDeFormulario(capturado, "Não foi possível salvar o registro."));
      setSalvando(false);
    }
  }

  const campoLote = editando ? (
    <CampoCustomizado rotulo="Lote">
      <p className="text-[15px] md:text-[13.5px] font-medium py-[10px]">{lote?.nome ?? "—"}</p>
    </CampoCustomizado>
  ) : (
    <CampoCustomizado rotulo="Lote" htmlFor={idLote} erro={erro.campos.loteId}>
      <SeletorLote
        id={idLote}
        lotes={lotes}
        value={valores.loteId}
        onChange={(loteId) => setValores({ ...valores, loteId })}
        erro={erro.campos.loteId}
        required
      />
    </CampoCustomizado>
  );

  return (
    <FormularioEmOverlay
      titulo={editando ? "Editar registro" : "Registrar perda"}
      descricao={
        editando && lote ? (
          <>
            No lote <strong>{lote.nome}</strong>, que entrou em {formatarDataBR(lote.dataEntrada)}.
          </>
        ) : (
          "Escolha o lote e informe quantas aves foram perdidas."
        )
      }
      temAlteracoes={temAlteracoes}
      aoFechar={aoFechar}
    >
      <FormularioMortalidade
        campoLote={campoLote}
        valores={valores}
        erro={erro}
        salvando={salvando}
        dataMinima={lote?.dataEntrada}
        aoMudar={setValores}
        aoEnviar={handleEnviar}
      />
    </FormularioEmOverlay>
  );
}
