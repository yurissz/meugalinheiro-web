import { useEffect, useState, type ReactNode } from "react";
import {
  EVENTO_SESSAO_EXPIRADA,
  getSessao,
  limparSessao,
  salvarSessao,
  type Sessao,
} from "../../shared/api/session";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(() => getSessao());
  const [expirou, setExpirou] = useState(false);

  // O cliente HTTP avisa quando a API recusa o token (401/403). Sem isso, o app ficava
  // "logado" com um token morto, mostrando erro de carregamento em todas as telas.
  useEffect(() => {
    function aoExpirar() {
      setSessao(null);
      setExpirou(true);
    }
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, aoExpirar);
  }, []);

  function entrar(novaSessao: Sessao) {
    salvarSessao(novaSessao);
    setSessao(novaSessao);
    setExpirou(false);
  }

  function sair() {
    limparSessao();
    setSessao(null);
    setExpirou(false);
  }

  return <AuthContext.Provider value={{ sessao, expirou, entrar, sair }}>{children}</AuthContext.Provider>;
}
