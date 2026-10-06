import { hojeIso } from "../../../shared/format";
import type { LoteResponse } from "../../lote/types";
import type { TipoVacinaResponse } from "../../tipoVacina/types";
import { dataSugerida } from "../sugestaoData";
import type { VacinacaoResponse } from "../types";

/** Valor sentinela do seletor: abre os campos de cadastro no próprio formulário. */
export const CADASTRAR_NOVA = "__cadastrar-nova__";

export const NOMES_SUGERIDOS = ["Newcastle", "Gumboro", "Bouba Aviária", "Bronquite", "Marek"];

export interface DadosFormularioVacinacao {
  loteId: string;
  tipoVacinaId: string;
  nomeNovaVacina: string;
  idadeNovaVacina: string;
  dataPrevista: string;
  dataAplicada: string;
}

export function vacinacaoVazia(
  lote: LoteResponse | undefined,
  tipo: TipoVacinaResponse | undefined,
): DadosFormularioVacinacao {
  return {
    loteId: lote?.id ?? "",
    tipoVacinaId: tipo?.id ?? CADASTRAR_NOVA,
    nomeNovaVacina: "",
    idadeNovaVacina: "",
    dataPrevista: dataSugerida(lote, tipo) ?? hojeIso(),
    dataAplicada: "",
  };
}

export function dadosDaVacinacao(
  vacinacao: VacinacaoResponse | null,
  lote: LoteResponse | undefined,
  tipo: TipoVacinaResponse | undefined,
): DadosFormularioVacinacao {
  if (!vacinacao) return vacinacaoVazia(lote, tipo);
  return {
    loteId: vacinacao.loteId,
    tipoVacinaId: vacinacao.tipoVacinaId,
    nomeNovaVacina: "",
    idadeNovaVacina: "",
    dataPrevista: vacinacao.dataPrevista,
    dataAplicada: vacinacao.dataAplicada ?? "",
  };
}

export function mesmosDadosDeVacinacao(a: DadosFormularioVacinacao, b: DadosFormularioVacinacao): boolean {
  return (
    a.loteId === b.loteId &&
    a.tipoVacinaId === b.tipoVacinaId &&
    a.nomeNovaVacina === b.nomeNovaVacina &&
    a.idadeNovaVacina === b.idadeNovaVacina &&
    a.dataPrevista === b.dataPrevista &&
    a.dataAplicada === b.dataAplicada
  );
}

export function nomesAindaNaoCadastrados(tiposVacina: TipoVacinaResponse[]): string[] {
  const existentes = new Set(tiposVacina.map((tipo) => tipo.nome.trim().toLowerCase()));
  return NOMES_SUGERIDOS.filter((nome) => !existentes.has(nome.toLowerCase()));
}
