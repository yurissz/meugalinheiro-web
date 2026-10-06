import type { LoteResponse } from "../lote/types";
import type { TipoVacinaResponse } from "../tipoVacina/types";

export function dataSugerida(lote: LoteResponse | undefined, tipo: TipoVacinaResponse | undefined): string | null {
  if (!lote || !tipo?.idadeSemanasRecomendada) return null;

  const data = new Date(`${lote.dataEntrada}T00:00:00`);
  data.setDate(data.getDate() + tipo.idadeSemanasRecomendada * 7);

  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}
