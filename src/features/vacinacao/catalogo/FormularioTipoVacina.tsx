import type { FormEvent } from "react";
import { CampoTexto } from "../../../shared/components/Campo";
import { AcoesFormulario } from "../../../shared/components/overlay/AcoesFormulario";
import type { ErroDeFormulario } from "../../../shared/api/errosFormulario";
import type { DadosFormularioTipoVacina } from "./tipoVacinaFormulario";

interface FormularioTipoVacinaProps {
  valores: DadosFormularioTipoVacina;
  erro: ErroDeFormulario;
  salvando: boolean;
  aoMudar: (valores: DadosFormularioTipoVacina) => void;
  aoEnviar: (evento: FormEvent) => void;
}

export function FormularioTipoVacina({ valores, erro, salvando, aoMudar, aoEnviar }: FormularioTipoVacinaProps) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <CampoTexto
          rotulo="Nome"
          value={valores.nome}
          onChange={(e) => aoMudar({ ...valores, nome: e.target.value })}
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
          value={valores.idadeSemanasRecomendada}
          onChange={(e) => aoMudar({ ...valores, idadeSemanasRecomendada: e.target.value })}
          placeholder="6"
          erro={erro.campos.idadeSemanasRecomendada}
          dica="Em semanas de vida. Usamos para sugerir a data ao programar."
        />
      </div>

      <AcoesFormulario salvando={salvando} textoConfirmar="Salvar" />
    </form>
  );
}
