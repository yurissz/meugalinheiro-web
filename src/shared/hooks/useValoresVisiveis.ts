import { useState } from "react";
import { useEhDesktop } from "./useEhDesktop";

const CHAVE = "meu-galinheiro:valores-visiveis";

/**
 * Preferência (persistida) de mostrar ou ocultar valores sensíveis (lucro, receitas,
 * despesas, aves ativas...) com asteriscos. Compartilhada entre telas via localStorage:
 * cada página lê o valor salvo ao montar, então ocultar no Financeiro também mantém
 * oculto ao navegar pro Dashboard, sem precisar de um estado global em memória.
 *
 * A ocultação só se aplica no desktop — no mobile o app é de uso mais pessoal/rápido
 * (tela não fica exposta do mesmo jeito que um monitor compartilhado), então os valores
 * sempre aparecem, independente da preferência salva.
 */
export function useValoresVisiveis() {
  const [preferencia, setPreferencia] = useState(() => localStorage.getItem(CHAVE) !== "false");
  const ehDesktop = useEhDesktop();

  function alternar() {
    setPreferencia((atual) => {
      const novo = !atual;
      localStorage.setItem(CHAVE, String(novo));
      return novo;
    });
  }

  return { visivel: preferencia || !ehDesktop, alternar, controlavel: ehDesktop };
}
