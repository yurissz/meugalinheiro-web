import type { FormEvent, ReactNode } from "react";
import { CampoTexto } from "../../shared/components/Campo";
import { AcoesFormulario } from "../../shared/components/overlay/AcoesFormulario";
import type { ErroDeFormulario } from "../../shared/api/errosFormulario";
import { hojeIso } from "../../shared/format";
import type { DadosFormularioMortalidade } from "./mortalidadeFormulario";

interface FormularioMortalidadeProps {
  campoLote: ReactNode;
  valores: DadosFormularioMortalidade;
  erro: ErroDeFormulario;
  salvando: boolean;
  dataMinima?: string;
  aoMudar: (valores: DadosFormularioMortalidade) => void;
  aoEnviar: (evento: FormEvent) => void;
}

export function FormularioMortalidade({
  campoLote,
  valores,
  erro,
  salvando,
  dataMinima,
  aoMudar,
  aoEnviar,
}: FormularioMortalidadeProps) {
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

      <div className="mb-4">{campoLote}</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-4">
        <CampoTexto
          rotulo="Data"
          type="date"
          min={dataMinima}
          max={hojeIso()}
          value={valores.data}
          onChange={(e) => aoMudar({ ...valores, data: e.target.value })}
          erro={erro.campos.data}
          required
        />
        <CampoTexto
          rotulo="Quantidade de aves"
          type="number"
          inputMode="numeric"
          min={1}
          value={valores.quantidade}
          onChange={(e) => aoMudar({ ...valores, quantidade: e.target.value })}
          erro={erro.campos.quantidade}
          required
        />
      </div>

      <CampoTexto
        rotulo="Causa (opcional)"
        value={valores.causa}
        onChange={(e) => aoMudar({ ...valores, causa: e.target.value })}
        placeholder="Ex: doença respiratória"
        erro={erro.campos.causa}
        maxLength={120}
      />

      <AcoesFormulario salvando={salvando} textoConfirmar="Salvar registro" />
    </form>
  );
}
