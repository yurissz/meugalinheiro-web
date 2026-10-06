import { ApiError } from "./errors";
import { campoDaRegraDeNegocio, humanizarMensagem } from "./regrasDeNegocio";

export interface ErroDeFormulario {
  /** Mensagem geral, pro topo do formulário. */
  mensagem: string;
  /** Mensagem por campo, na mesma chave que o backend manda em `campos[].campo`. */
  campos: Record<string, string>;
}

export const SEM_ERRO: ErroDeFormulario = { mensagem: "", campos: {} };

/**
 * Traduz qualquer erro capturado num formulário pro formato que as telas exibem.
 *
 * Duas fontes de erro de campo: o `campos[]` que o Bean Validation do backend manda
 * pronto, e as regras de negócio, que chegam só como mensagem geral — essas são
 * redirecionadas pro campo certo por `campoDaRegraDeNegocio`.
 */
export function lerErroDeFormulario(erro: unknown, mensagemPadrao: string): ErroDeFormulario {
  if (!(erro instanceof ApiError)) {
    return { mensagem: mensagemPadrao, campos: {} };
  }

  const mensagem = humanizarMensagem(erro.message || mensagemPadrao);

  if (erro.campos.length > 0) {
    const campos: Record<string, string> = {};
    for (const campo of erro.campos) {
      campos[campo.campo] = humanizarMensagem(campo.mensagem);
    }
    return { mensagem, campos };
  }

  const campoDaRegra = campoDaRegraDeNegocio(mensagem);
  if (campoDaRegra) {
    return { mensagem: "", campos: { [campoDaRegra]: mensagem } };
  }

  return { mensagem, campos: {} };
}

/** Mensagem de lista/carregamento: mesma ideia, sem o mapa de campos. */
export function lerMensagemDeErro(erro: unknown, mensagemPadrao: string): string {
  return erro instanceof ApiError && erro.message ? humanizarMensagem(erro.message) : mensagemPadrao;
}
