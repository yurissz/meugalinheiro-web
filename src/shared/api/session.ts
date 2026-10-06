const CHAVE_SESSAO = "meu-galinheiro:sessao";

/**
 * Disparado quando a API recusa o token (expirado ou inválido). O AuthProvider escuta e
 * derruba a sessão — assim qualquer tela, em qualquer ponto do app, cai no login em vez
 * de ficar mostrando "não foi possível carregar" para sempre.
 */
export const EVENTO_SESSAO_EXPIRADA = "meu-galinheiro:sessao-expirada";

export interface Sessao {
  token: string;
  produtorId: string;
  nome: string;
}

export function getSessao(): Sessao | null {
  const bruto = localStorage.getItem(CHAVE_SESSAO);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as Sessao;
  } catch {
    return null;
  }
}

export function salvarSessao(sessao: Sessao): void {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export function limparSessao(): void {
  localStorage.removeItem(CHAVE_SESSAO);
}

export function getToken(): string | null {
  return getSessao()?.token ?? null;
}

export function encerrarSessaoExpirada(): void {
  limparSessao();
  window.dispatchEvent(new Event(EVENTO_SESSAO_EXPIRADA));
}
