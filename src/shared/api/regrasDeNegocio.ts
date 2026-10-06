const ISO_DATA = /(\d{4})-(\d{2})-(\d{2})/g;

export function humanizarMensagem(mensagem: string): string {
  return mensagem.replace(ISO_DATA, (_, ano, mes, dia) => `${dia}/${mes}/${ano}`);
}

const CAMPO_POR_PADRAO: Array<{ padrao: RegExp; campo: string }> = [
  { padrao: /aves vivas/i, campo: "quantidade" },
  { padrao: /data de aplicação/i, campo: "dataAplicada" },
  { padrao: /data prevista/i, campo: "dataPrevista" },
  { padrao: /a data não pode ser/i, campo: "data" },
  { padrao: /tipo de vacina/i, campo: "tipoVacinaId" },
  { padrao: /vacina com esse nome/i, campo: "nome" },
  { padrao: /lote foi encerrado/i, campo: "loteId" },
  { padrao: /celular/i, campo: "celular" },
];

export function campoDaRegraDeNegocio(mensagem: string): string | null {
  return CAMPO_POR_PADRAO.find(({ padrao }) => padrao.test(mensagem))?.campo ?? null;
}
