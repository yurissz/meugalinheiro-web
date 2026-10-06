// Aceita string | null | undefined porque o valor vem de dados da API — em tese o
// contrato garante string, mas um registro incompleto no backend não pode quebrar a
// renderização da tela inteira só porque uma data está faltando.
export function formatarDataBR(dataIso: string | null | undefined): string {
  if (!dataIso) return "—";
  const [ano, mes, dia] = dataIso.split("-");
  if (!ano || !mes || !dia) return "—";
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

// Comparador pra ordenar por data ISO (string) quando o campo pode vir nulo/vazio de um
// registro incompleto — sem isso, Array.sort quebra com "Cannot read properties of null"
// e derruba a lista inteira por causa de um único item com dado faltando. Datas ausentes
// vão pro fim (chame com os argumentos invertidos pra ordem decrescente).
export function compararDataIso(a: string | null | undefined, b: string | null | undefined): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b);
}

/*
 * Data de hoje no fuso de quem está usando, montada a partir das partes locais.
 * toISOString() converte pra UTC: no Brasil (UTC-3), depois das 21h ele já devolve a data
 * de amanhã — e o registro da noite ia parar no dia seguinte sem ninguém perceber.
 */
export function hojeIso(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

export function anoMesAtual(): { ano: number; mes: number } {
  const hoje = new Date();
  return { ano: hoje.getFullYear(), mes: hoje.getMonth() + 1 };
}

const NOMES_MES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function nomeMes(mes: number): string {
  return NOMES_MES[mes - 1] ?? "";
}

export function saudacaoPorHorario(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}
