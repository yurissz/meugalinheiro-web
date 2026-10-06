import { createContext, useContext } from "react";

export const ContextoOverlay = createContext<(() => void) | null>(null);

/**
 * Pedido de fechamento do overlay que envolve o formulário: passa pela confirmação de
 * descarte quando há algo digitado. Existe como contexto pra que todo caminho de saída
 * (Esc, voltar do celular, ✕, clique no fundo e o botão Cancelar do rodapé) seja o mesmo
 * por construção, sem cada formulário ter que repassar a função campo a campo.
 */
export function useFecharOverlay(): () => void {
  const fechar = useContext(ContextoOverlay);
  if (!fechar) throw new Error("useFecharOverlay precisa estar dentro de <FormularioEmOverlay>.");
  return fechar;
}
