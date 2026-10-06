import type { ReactNode } from "react";
import { iconeAlvo, iconeCifrao, iconeInicio, iconeLotesPilha, iconePena, iconeSeringa } from "./icons";

export type TelaId = "dashboard" | "lotes" | "registro" | "financeiro" | "vacinas" | "mortalidade";

/*
 * Cada tela tem a sua URL. Antes a navegação era estado local: o botão "voltar" do
 * celular saía do app inteiro, recarregar sempre caía no painel e não dava pra mandar
 * link de uma tela pra ninguém.
 */
export const CAMINHOS = {
  dashboard: "/app",
  lotes: "/app/lotes",
  registro: "/app/registro",
  financeiro: "/app/financeiro",
  vacinas: "/app/vacinas",
  mortalidade: "/app/mortalidade",
} satisfies Record<TelaId, string> & Record<string, unknown>;

interface ItemNav {
  id: TelaId;
  rotulo: string;
  icone: ReactNode;
  caminho: string;
}

/*
 * O protótipo tinha uma 6ª tela, "Produção" (coleta de ovos/taxa de postura),
 * mas ela depende 100% de dados que a API ainda não tem (v2), então não entra
 * no menu por enquanto.
 */
export const ITENS_NAV: ItemNav[] = [
  { id: "dashboard", rotulo: "Início", icone: iconeInicio, caminho: CAMINHOS.dashboard },
  { id: "lotes", rotulo: "Lotes", icone: iconeLotesPilha, caminho: CAMINHOS.lotes },
  { id: "registro", rotulo: "Novo registro", icone: iconeAlvo, caminho: CAMINHOS.registro },
  { id: "financeiro", rotulo: "Financeiro", icone: iconeCifrao, caminho: CAMINHOS.financeiro },
  { id: "mortalidade", rotulo: "Mortalidade", icone: iconePena, caminho: CAMINHOS.mortalidade },
  { id: "vacinas", rotulo: "Vacinação", icone: iconeSeringa, caminho: CAMINHOS.vacinas },
];
