import { useEffect, useState } from "react";

const CONSULTA = "(min-width: 768px)";

/**
 * Mesmo ponto de corte (768px, breakpoint `md` do Tailwind) usado nas telas para trocar
 * tabela por cards empilhados. Usado pra decidir se a ocultação de valores com "****" se
 * aplica — no mobile os valores ficam sempre visíveis.
 */
export function useEhDesktop() {
  const [ehDesktop, setEhDesktop] = useState(() => window.matchMedia(CONSULTA).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(CONSULTA);
    const atualizar = () => setEhDesktop(mediaQuery.matches);
    atualizar();
    mediaQuery.addEventListener("change", atualizar);
    return () => mediaQuery.removeEventListener("change", atualizar);
  }, []);

  return ehDesktop;
}
