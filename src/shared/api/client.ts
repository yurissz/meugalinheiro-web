import { ApiError, type ApiErrorBody } from "./errors";
import { encerrarSessaoExpirada, getToken } from "./session";

/*
 * A URL da API vem do build (VITE_API_URL), nunca hardcoded: em produção ela aponta pro
 * host da API, em desenvolvimento cai no localhost. Se faltar no build de produção,
 * falhamos com uma mensagem clara em vez de tentar localhost no celular de alguém.
 */
const urlConfigurada = import.meta.env.VITE_API_URL?.trim();
const BASE_URL = urlConfigurada || (import.meta.env.DEV ? "http://localhost:8081" : "");

interface OpcoesRequisicao {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

/** Só aceitamos como corpo de erro o que realmente tem o formato da API. */
function corpoDeErroValido(dados: unknown): dados is ApiErrorBody {
  return (
    typeof dados === "object" &&
    dados !== null &&
    typeof (dados as ApiErrorBody).mensagem === "string" &&
    (dados as ApiErrorBody).mensagem.trim() !== ""
  );
}

function mensagemPadrao(status: number): string {
  if (status === 401 || status === 403) return "Sua sessão expirou. Entre de novo para continuar.";
  if (status === 404) return "Esse registro não existe mais. Atualize a tela.";
  if (status >= 500) return "A API teve um problema. Tente de novo em instantes.";
  return "Não foi possível completar a operação.";
}

export async function apiRequest<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error("VITE_API_URL não foi configurada neste build — a API não tem endereço.");
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    method: opcoes.method ?? "GET",
    headers,
    body: opcoes.body !== undefined ? JSON.stringify(opcoes.body) : undefined,
  });

  if (resposta.status === 204) {
    return undefined as T;
  }

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    // Token recusado: derruba a sessão na hora. Só faz sentido se a gente tinha um token —
    // um 401 na tela de login é "senha errada", não "sessão expirada".
    if ((resposta.status === 401 || resposta.status === 403) && token) {
      encerrarSessaoExpirada();
    }

    throw new ApiError(
      corpoDeErroValido(dados)
        ? { ...dados, status: dados.status || resposta.status }
        : { status: resposta.status, mensagem: mensagemPadrao(resposta.status) },
    );
  }

  return dados as T;
}
