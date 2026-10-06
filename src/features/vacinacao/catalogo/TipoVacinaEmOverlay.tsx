import { useState, type FormEvent } from "react";
import { FormularioEmOverlay } from "../../../shared/components/overlay/FormularioEmOverlay";
import { useNotificacao } from "../../../shared/notificacao/useNotificacao";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../../shared/api/errosFormulario";
import { atualizarTipoVacina, criarTipoVacina } from "../../tipoVacina/api";
import type { TipoVacinaResponse } from "../../tipoVacina/types";
import { FormularioTipoVacina } from "./FormularioTipoVacina";
import { dadosDoTipoVacina, mesmosDadosDeTipoVacina } from "./tipoVacinaFormulario";

interface TipoVacinaEmOverlayProps {
  /** `null` cadastra uma vacina nova no catálogo; um tipo edita aquele tipo. */
  tipo: TipoVacinaResponse | null;
  aoFechar: () => void;
  aoSalvar: () => void;
}

export function TipoVacinaEmOverlay({ tipo, aoFechar, aoSalvar }: TipoVacinaEmOverlayProps) {
  const { notificarSucesso } = useNotificacao();
  const iniciais = dadosDoTipoVacina(tipo);

  const [valores, setValores] = useState(iniciais);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  const editando = tipo !== null;
  const temAlteracoes = !mesmosDadosDeTipoVacina(valores, iniciais);

  async function handleEnviar(evento: FormEvent) {
    evento.preventDefault();
    setSalvando(true);
    setErro(SEM_ERRO);

    const dados = {
      nome: valores.nome,
      idadeSemanasRecomendada: valores.idadeSemanasRecomendada
        ? Number(valores.idadeSemanasRecomendada)
        : undefined,
    };

    try {
      if (tipo) {
        await atualizarTipoVacina(tipo.id, dados);
        notificarSucesso(`${dados.nome} atualizada.`);
      } else {
        await criarTipoVacina(dados);
        notificarSucesso(`${dados.nome} entrou na sua lista de vacinas.`);
      }
      aoSalvar();
      aoFechar();
    } catch (capturado) {
      setErro(lerErroDeFormulario(capturado, "Não foi possível salvar a vacina."));
      setSalvando(false);
    }
  }

  return (
    <FormularioEmOverlay
      titulo={editando ? "Editar vacina" : "Cadastrar vacina"}
      descricao="Vacinas cadastradas aqui ficam disponíveis para programar em qualquer lote."
      temAlteracoes={temAlteracoes}
      aoFechar={aoFechar}
    >
      <FormularioTipoVacina
        valores={valores}
        erro={erro}
        salvando={salvando}
        aoMudar={setValores}
        aoEnviar={handleEnviar}
      />
    </FormularioEmOverlay>
  );
}
