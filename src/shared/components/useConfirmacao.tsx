import { useEffect, useRef, useState, type ReactNode } from "react";
import { Botao } from "./Botao";

interface PedidoConfirmacao {
  titulo: string;
  mensagem: ReactNode;
  textoConfirmar?: string;
  /** Pinta o botão de confirmar como ação destrutiva (excluir). */
  destrutivo?: boolean;
}

/**
 * Substitui o window.confirm: no celular ele é um diálogo do sistema, sem identidade
 * nenhuma e fácil de confirmar por engano. Aqui o botão de confirmar é o que precisa de
 * intenção, Esc cancela, e o foco vai pro diálogo.
 *
 * z-[55]: acima do formulário em overlay (z-50), que usa este diálogo pra confirmar o
 * descarte do que foi digitado, e abaixo das notificações (z-[60]).
 *
 * Uso:
 *   const { confirmar, dialogo } = useConfirmacao();
 *   if (!(await confirmar({ titulo: "Excluir lote", mensagem: "..." }))) return;
 *   ...
 *   return (<> ... {dialogo} </>)
 */
export function useConfirmacao() {
  const [pedido, setPedido] = useState<PedidoConfirmacao | null>(null);
  const resolverRef = useRef<((valor: boolean) => void) | null>(null);
  const botaoRef = useRef<HTMLButtonElement | null>(null);

  function responder(valor: boolean) {
    resolverRef.current?.(valor);
    resolverRef.current = null;
    setPedido(null);
  }

  function confirmar(novoPedido: PedidoConfirmacao): Promise<boolean> {
    setPedido(novoPedido);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }

  useEffect(() => {
    if (!pedido) return;
    botaoRef.current?.focus();
    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") responder(false);
    }
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [pedido]);

  const dialogo = pedido ? (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center p-4 bg-tinta/45">
      <button
        type="button"
        aria-label="Cancelar"
        tabIndex={-1}
        onClick={() => responder(false)}
        className="absolute inset-0 cursor-default"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacao"
        className="relative w-full max-w-sm bg-white rounded-app border border-borda shadow-xl p-5"
      >
        <h2 id="titulo-confirmacao" className="font-heading text-[16px] font-semibold mb-2">
          {pedido.titulo}
        </h2>
        <div className="text-[13.5px] text-cinza leading-relaxed mb-5">{pedido.mensagem}</div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Botao type="button" onClick={() => responder(false)} className="w-full sm:w-auto">
            Cancelar
          </Botao>
          <Botao
            ref={botaoRef}
            type="button"
            variante={pedido.destrutivo ? "perigo" : "primary"}
            onClick={() => responder(true)}
            className="w-full sm:w-auto"
          >
            {pedido.textoConfirmar ?? "Confirmar"}
          </Botao>
        </div>
      </div>
    </div>
  ) : null;

  return { confirmar, dialogo };
}
