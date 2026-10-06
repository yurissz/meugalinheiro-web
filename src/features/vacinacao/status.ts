/*
 * A API calcula o status da vacinação no backend e devolve como string:
 * "Em dia", "Próxima", "Atrasada" ou "Aplicada" (confirmado testando a API
 * real, o schema OpenAPI só diz "string" sem listar os valores possíveis).
 */
export const tomPorStatusVacina: Record<string, "ok" | "warn" | "bad"> = {
  Aplicada: "ok",
  "Em dia": "ok",
  Próxima: "warn",
  Atrasada: "bad",
};

// Um registro com status ausente/desconhecido (dado incompleto vindo da API) não pode
// ficar com um badge vazio nem quebrar o tom visual — cai num "aviso" neutro com rótulo
// explícito em vez de string vazia.
export function tomVacina(status: string | null | undefined): "ok" | "warn" | "bad" {
  return (status && tomPorStatusVacina[status]) || "warn";
}

export function rotuloVacina(status: string | null | undefined): string {
  return status && status.trim() ? status : "Sem status";
}
