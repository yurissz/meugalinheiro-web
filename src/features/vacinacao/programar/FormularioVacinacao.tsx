import type { FormEvent } from "react";
import { CampoSelecao, CampoTexto } from "../../../shared/components/Campo";
import { AcoesFormulario } from "../../../shared/components/overlay/AcoesFormulario";
import type { ErroDeFormulario } from "../../../shared/api/errosFormulario";
import { formatarDataBR, hojeIso } from "../../../shared/format";
import type { LoteResponse } from "../../lote/types";
import type { TipoVacinaResponse } from "../../tipoVacina/types";
import { dataSugerida } from "../sugestaoData";
import { CADASTRAR_NOVA, type DadosFormularioVacinacao } from "./vacinacaoFormulario";

interface FormularioVacinacaoProps {
  lotes: LoteResponse[];
  tiposVacina: TipoVacinaResponse[];
  nomesSugeridos: string[];
  valores: DadosFormularioVacinacao;
  erro: ErroDeFormulario;
  salvando: boolean;
  editando: boolean;
  aoMudar: (valores: DadosFormularioVacinacao) => void;
  aoEnviar: (evento: FormEvent) => void;
}

export function FormularioVacinacao({
  lotes,
  tiposVacina,
  nomesSugeridos,
  valores,
  erro,
  salvando,
  editando,
  aoMudar,
  aoEnviar,
}: FormularioVacinacaoProps) {
  const lote = lotes.find((item) => item.id === valores.loteId);
  const tipoSelecionado = tiposVacina.find((tipo) => tipo.id === valores.tipoVacinaId);
  const cadastrandoNova = valores.tipoVacinaId === CADASTRAR_NOVA;
  const sugestao = dataSugerida(lote, tipoSelecionado);

  function trocarLote(loteId: string) {
    const novoLote = lotes.find((item) => item.id === loteId);
    const novaSugestao = dataSugerida(novoLote, tipoSelecionado);
    aoMudar({ ...valores, loteId, dataPrevista: novaSugestao ?? valores.dataPrevista });
  }

  function trocarTipo(tipoVacinaId: string) {
    const novoTipo = tiposVacina.find((tipo) => tipo.id === tipoVacinaId);
    const novaSugestao = dataSugerida(lote, novoTipo);
    aoMudar({ ...valores, tipoVacinaId, dataPrevista: novaSugestao ?? valores.dataPrevista });
  }

  return (
    <form onSubmit={aoEnviar} className="px-5 pt-4">
      {erro.mensagem && (
        <div
          role="alert"
          className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4"
        >
          {erro.mensagem}
        </div>
      )}

      {!editando && (
        <CampoSelecao
          rotulo="Lote"
          value={valores.loteId}
          onChange={(e) => trocarLote(e.target.value)}
          erro={erro.campos.loteId}
          className="mb-4"
          required
        >
          <option value="">Escolha um lote</option>
          {lotes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </CampoSelecao>
      )}

      <CampoSelecao
        rotulo="Vacina"
        value={valores.tipoVacinaId}
        onChange={(e) => trocarTipo(e.target.value)}
        erro={erro.campos.tipoVacinaId}
        className="mb-4"
        required
      >
        {tiposVacina.map((tipo) => (
          <option key={tipo.id} value={tipo.id}>
            {tipo.nome}
            {tipo.idadeSemanasRecomendada ? ` — ${tipo.idadeSemanasRecomendada} semanas` : ""}
          </option>
        ))}
        <option value={CADASTRAR_NOVA}>+ Cadastrar outra vacina</option>
      </CampoSelecao>

      {cadastrandoNova && (
        <div className="bg-verde-claro rounded-app px-4 py-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            <CampoTexto
              rotulo="Nome da vacina"
              value={valores.nomeNovaVacina}
              onChange={(e) => aoMudar({ ...valores, nomeNovaVacina: e.target.value })}
              placeholder="Newcastle"
              erro={erro.campos.nome}
              maxLength={60}
              required
            />
            <CampoTexto
              rotulo="Idade recomendada (opcional)"
              type="number"
              inputMode="numeric"
              min={1}
              max={520}
              value={valores.idadeNovaVacina}
              onChange={(e) => aoMudar({ ...valores, idadeNovaVacina: e.target.value })}
              placeholder="6"
              erro={erro.campos.idadeSemanasRecomendada}
              dica="Em semanas de vida."
            />
          </div>

          {nomesSugeridos.length > 0 && (
            <div className="mt-3">
              <p className="text-[12.5px] text-cinza mb-2">As mais usadas:</p>
              <div className="flex flex-wrap gap-2">
                {nomesSugeridos.map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    onClick={() => aoMudar({ ...valores, nomeNovaVacina: nome })}
                    className="min-h-[40px] px-3.5 rounded-full border border-verde bg-white text-[14px] md:text-[13px] text-verde font-medium cursor-pointer hover:bg-verde hover:text-white transition-colors"
                  >
                    {nome}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <CampoTexto
          rotulo="Prevista para"
          type="date"
          min={lote?.dataEntrada}
          value={valores.dataPrevista}
          onChange={(e) => aoMudar({ ...valores, dataPrevista: e.target.value })}
          erro={erro.campos.dataPrevista}
          dica={
            sugestao && sugestao === valores.dataPrevista
              ? `Sugerido: ${tipoSelecionado?.idadeSemanasRecomendada} semanas de idade.`
              : sugestao
                ? `Recomendada às ${tipoSelecionado?.idadeSemanasRecomendada} semanas — ${formatarDataBR(sugestao)}.`
                : undefined
          }
          required
        />
        {editando && (
          <CampoTexto
            rotulo="Aplicada em (opcional)"
            type="date"
            min={lote?.dataEntrada}
            max={hojeIso()}
            value={valores.dataAplicada}
            onChange={(e) => aoMudar({ ...valores, dataAplicada: e.target.value })}
            erro={erro.campos.dataAplicada}
            dica="Deixe vazio para voltar a pendente."
          />
        )}
      </div>

      <AcoesFormulario salvando={salvando} textoConfirmar={editando ? "Salvar" : "Programar"} />
    </form>
  );
}
