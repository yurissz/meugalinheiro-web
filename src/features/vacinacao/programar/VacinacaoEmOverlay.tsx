import { useState, type FormEvent } from "react";
import { FormularioEmOverlay } from "../../../shared/components/overlay/FormularioEmOverlay";
import { useNotificacao } from "../../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../../shared/api/errosFormulario";
import { formatarDataBR } from "../../../shared/format";
import type { LoteResponse } from "../../lote/types";
import { criarTipoVacina } from "../../tipoVacina/api";
import type { TipoVacinaResponse } from "../../tipoVacina/types";
import { atualizarVacinacao, criarVacinacao } from "../api";
import type { VacinacaoResponse } from "../types";
import { FormularioVacinacao } from "./FormularioVacinacao";
import {
  CADASTRAR_NOVA,
  dadosDaVacinacao,
  mesmosDadosDeVacinacao,
  nomesAindaNaoCadastrados,
} from "./vacinacaoFormulario";

interface VacinacaoEmOverlayProps {
  lotes: LoteResponse[];
  tiposVacina: TipoVacinaResponse[];
  loteInicialId: string;
  /** `null` programa uma aplicação nova; uma vacinação edita aquela aplicação. */
  vacinacao: VacinacaoResponse | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export function VacinacaoEmOverlay({
  lotes,
  tiposVacina,
  loteInicialId,
  vacinacao,
  aoFechar,
  aoSalvar,
}: VacinacaoEmOverlayProps) {
  const { notificarSucesso } = useNotificacao();

  const lotesDisponiveis = lotes.filter((lote) => lote.ativo);
  const loteInicial =
    lotesDisponiveis.find((lote) => lote.id === loteInicialId) ??
    (lotesDisponiveis.length === 1 ? lotesDisponiveis[0] : undefined);

  const tipoHistorico =
    vacinacao && !tiposVacina.some((tipo) => tipo.id === vacinacao.tipoVacinaId)
      ? [{ id: vacinacao.tipoVacinaId, nome: vacinacao.tipoVacinaNome, idadeSemanasRecomendada: null, ativo: false }]
      : [];
  const tiposDisponiveis = [...tiposVacina, ...tipoHistorico];

  const iniciais = dadosDaVacinacao(vacinacao, loteInicial, tiposDisponiveis[0]);

  const [valores, setValores] = useState(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  const editando = vacinacao !== null;
  const temAlteracoes = !mesmosDadosDeVacinacao(valores, iniciais);
  const lote = lotes.find((item) => item.id === valores.loteId);

  async function resolverTipoVacinaId(): Promise<string> {
    if (valores.tipoVacinaId !== CADASTRAR_NOVA) return valores.tipoVacinaId;

    const criado = await criarTipoVacina({
      nome: valores.nomeNovaVacina.trim(),
      idadeSemanasRecomendada: valores.idadeNovaVacina ? Number(valores.idadeNovaVacina) : undefined,
    });
    return criado.id;
  }

  async function handleEnviar(evento: FormEvent) {
    evento.preventDefault();

    if (!valores.loteId) {
      setErro({ mensagem: "", campos: { loteId: "Escolha o lote que vai receber a vacina." } });
      return;
    }

    if (lote && valores.dataPrevista < lote.dataEntrada) {
      setErro({
        mensagem: "",
        campos: {
          dataPrevista: `O lote entrou em ${formatarDataBR(lote.dataEntrada)} — escolha uma data a partir daí.`,
        },
      });
      return;
    }

    setSalvando(true);
    setErro(SEM_ERRO);

    try {
      const tipoVacinaId = await resolverTipoVacinaId();
      const nomeVacina =
        tiposDisponiveis.find((tipo) => tipo.id === tipoVacinaId)?.nome ?? (valores.nomeNovaVacina.trim() || "Vacina");

      if (vacinacao) {
        await atualizarVacinacao(vacinacao.id, {
          tipoVacinaId,
          dataPrevista: valores.dataPrevista,
          dataAplicada: valores.dataAplicada || undefined,
        });
        notificarSucesso(`${nomeVacina} atualizada.`);
      } else {
        await criarVacinacao({ loteId: valores.loteId, tipoVacinaId, dataPrevista: valores.dataPrevista });
        notificarSucesso(
          `${nomeVacina} programada para ${formatarDataBR(valores.dataPrevista)} em ${lote?.nome ?? "lote"}.`,
        );
      }
      aoSalvar();
      aoFechar();
    } catch (capturado) {
      setErro(lerErroDeFormulario(capturado, "Não foi possível salvar a vacinação."));
      setSalvando(false);
    }
  }

  return (
    <FormularioEmOverlay
      titulo={editando ? "Editar aplicação" : "Programar vacina"}
      descricao={
        editando && lote ? (
          <>
            No lote <strong>{lote.nome}</strong>, que entrou em {formatarDataBR(lote.dataEntrada)}.
          </>
        ) : (
          "Escolha o lote, a vacina e quando ela deve ser aplicada."
        )
      }
      temAlteracoes={temAlteracoes}
      aoFechar={aoFechar}
    >
      <FormularioVacinacao
        lotes={lotesDisponiveis}
        tiposVacina={tiposDisponiveis}
        nomesSugeridos={nomesAindaNaoCadastrados(tiposVacina)}
        valores={valores}
        erro={erro}
        salvando={salvando}
        editando={editando}
        aoMudar={setValores}
        aoEnviar={handleEnviar}
      />
    </FormularioEmOverlay>
  );
}
