import { useId, type FormEvent } from "react";
import { CampoCustomizado, CampoSelecao, CampoTexto } from "../../shared/components/Campo";
import { AcoesFormulario } from "../../shared/components/overlay/AcoesFormulario";
import type { ErroDeFormulario } from "../../shared/api/errosFormulario";
import { hojeIso } from "../../shared/format";
import { SeletorLote } from "../lote/SeletorLote";
import type { LoteResponse } from "../lote/types";
import type { TipoTransacao } from "./types";
import type { DadosFormularioTransacao } from "./transacaoFormulario";

interface FormularioTransacaoProps {
  lotes: LoteResponse[];
  valores: DadosFormularioTransacao;
  erro: ErroDeFormulario;
  salvando: boolean;
  textoConfirmar: string;
  aoMudar: (valores: DadosFormularioTransacao) => void;
  aoEnviar: (evento: FormEvent) => void;
}

export function FormularioTransacao({
  lotes,
  valores,
  erro,
  salvando,
  textoConfirmar,
  aoMudar,
  aoEnviar,
}: FormularioTransacaoProps) {
  const idLote = useId();

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
        <CampoSelecao
          rotulo="Tipo"
          value={valores.tipo}
          onChange={(e) => aoMudar({ ...valores, tipo: e.target.value as TipoTransacao })}
          erro={erro.campos.tipo}
        >
          <option value="RECEITA">Receita</option>
          <option value="DESPESA">Despesa</option>
        </CampoSelecao>
        <CampoTexto
          rotulo="Valor (R$)"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={valores.valor}
          onChange={(e) => aoMudar({ ...valores, valor: e.target.value })}
          erro={erro.campos.valor}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-4">
        <CampoTexto
          rotulo="Categoria"
          value={valores.categoria}
          onChange={(e) => aoMudar({ ...valores, categoria: e.target.value })}
          placeholder={valores.tipo === "RECEITA" ? "Venda de ovos" : "Ração"}
          erro={erro.campos.categoria}
          required
        />
        <CampoTexto
          rotulo="Data"
          type="date"
          max={hojeIso()}
          value={valores.data}
          onChange={(e) => aoMudar({ ...valores, data: e.target.value })}
          erro={erro.campos.data}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        <CampoCustomizado rotulo="Lote (opcional)" htmlFor={idLote} erro={erro.campos.loteId}>
          <SeletorLote
            id={idLote}
            lotes={lotes}
            value={valores.loteId}
            onChange={(id) => aoMudar({ ...valores, loteId: id })}
            opcaoVazia="Sem lote (geral)"
          />
        </CampoCustomizado>
        <CampoTexto
          rotulo="Descrição (opcional)"
          value={valores.descricao}
          onChange={(e) => aoMudar({ ...valores, descricao: e.target.value })}
          erro={erro.campos.descricao}
        />
      </div>

      <AcoesFormulario salvando={salvando} textoConfirmar={textoConfirmar} />
    </form>
  );
}
