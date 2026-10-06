import { createContext } from "react";
import type { Sessao } from "../../shared/api/session";

export interface AuthContextValue {
  sessao: Sessao | null;
  /** True quando a sessão caiu sozinha (token recusado pela API), não por clique em "Sair". */
  expirou: boolean;
  entrar: (sessao: Sessao) => void;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
