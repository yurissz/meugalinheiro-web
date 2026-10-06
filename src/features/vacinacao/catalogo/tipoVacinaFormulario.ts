import type { TipoVacinaResponse } from "../../tipoVacina/types";

export interface DadosFormularioTipoVacina {
  nome: string;
  idadeSemanasRecomendada: string;
}

export const TIPO_VACINA_VAZIO: DadosFormularioTipoVacina = { nome: "", idadeSemanasRecomendada: "" };

export function dadosDoTipoVacina(tipo: TipoVacinaResponse | null): DadosFormularioTipoVacina {
  if (!tipo) return TIPO_VACINA_VAZIO;
  return {
    nome: tipo.nome,
    idadeSemanasRecomendada: tipo.idadeSemanasRecomendada != null ? String(tipo.idadeSemanasRecomendada) : "",
  };
}

export function mesmosDadosDeTipoVacina(a: DadosFormularioTipoVacina, b: DadosFormularioTipoVacina): boolean {
  return a.nome === b.nome && a.idadeSemanasRecomendada === b.idadeSemanasRecomendada;
}
