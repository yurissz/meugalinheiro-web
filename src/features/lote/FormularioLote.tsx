import type { FormEvent } from "react";
import { CampoTexto } from "../../shared/components/Campo";
import { AcoesFormulario } from "../../shared/components/overlay/AcoesFormulario";
import type { ErroDeFormulario } from "../../shared/api/errosFormulario";
import { hojeIso } from "../../shared/format";
import type { DadosFormularioLote } from "./loteFormulario";

interface FormularioLoteProps {
  valores: DadosFormularioLote;
  erro: ErroDeFormulario;
  salvando: boolean;
  textoConfirmar: string;
  aoMudar: (valores: DadosFormularioLote) => void;
  aoEnviar: (evento: FormEvent) => void;
}

export function FormularioLote({
  valores,
  erro,
  salvando,
  textoConfirmar,
  aoMudar,
  aoEnviar,
}: FormularioLoteProps) {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-4">
        <CampoTexto
          rotulo="Nome do lote"
          value={valores.nome}
          onChange={(e) => aoMudar({ ...valores, nome: e.target.value })}
          placeholder="Lote 4"
          erro={erro.campos.nome}
          required
        />
        <CampoTexto
          rotulo="Data de entrada"
          type="date"
          max={hojeIso()}
          value={valores.dataEntrada}
          onChange={(e) => aoMudar({ ...valores, dataEntrada: e.target.value })}
          erro={erro.campos.dataEntrada}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <CampoTexto
          rotulo="Quantidade inicial"
          type="number"
          inputMode="numeric"
          min={1}
          value={valores.quantidadeInicial}
          onChange={(e) => aoMudar({ ...valores, quantidadeInicial: e.target.value })}
          placeholder="100"
          erro={erro.campos.quantidadeInicial}
          dica="Quantas aves entraram neste lote."
          required
        />
        <CampoTexto
          rotulo="Raça (opcional)"
          value={valores.raca}
          onChange={(e) => aoMudar({ ...valores, raca: e.target.value })}
          placeholder="Lohmann Brown"
          erro={erro.campos.raca}
        />
      </div>

      <AcoesFormulario salvando={salvando} textoConfirmar={textoConfirmar} />
    </form>
  );
}
