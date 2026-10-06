import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BotaoIcone } from "../BotaoIcone";
import { useConfirmacao } from "../useConfirmacao";
import { iconeChevronEsquerda, iconeX } from "../../icons";
import { ContextoOverlay } from "./contextoOverlay";
import { useOverlayFormulario } from "./useOverlayFormulario";

interface FormularioEmOverlayProps {
  titulo: string;
  descricao?: ReactNode;
  /** Liga a confirmação ao fechar: só pergunta se o usuário mexeu em algo de verdade. */
  temAlteracoes: boolean;
  aoFechar: () => void;
  children: ReactNode;
}

/**
 * Moldura única de todos os cadastros rápidos: modal sobre a tela no desktop, tela cheia
 * no celular. Uma árvore de DOM só — o tamanho da viewport troca classes e o controle de
 * fechar (← Voltar ou ✕), nunca o conteúdo. Dois ramos de JSX desmontariam os campos ao
 * girar o celular, apagando o que já tinha sido digitado.
 *
 * Fica aberto enquanto estiver montado: quem usa decide renderizando ou não.
 */
export function FormularioEmOverlay({ titulo, descricao, temAlteracoes, aoFechar, children }: FormularioEmOverlayProps) {
  const idTitulo = useId();
  const { confirmar, dialogo } = useConfirmacao();

  const { painelRef, ehDesktop, solicitarFechamento } = useOverlayFormulario({
    temAlteracoes,
    aoFechar,
    aoPedirConfirmacao: () =>
      confirmar({
        titulo: "Descartar o que você preencheu?",
        mensagem: "O que foi digitado aqui não será salvo.",
        textoConfirmar: "Descartar",
        destrutivo: true,
      }),
  });

  function handleFechar() {
    void solicitarFechamento();
  }

  return createPortal(
    <>
      <div
        className={
          ehDesktop
            ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-tinta/45"
            : "fixed inset-0 z-50 flex flex-col bg-white"
        }
      >
        {ehDesktop && (
          <button
            type="button"
            aria-label="Fechar"
            tabIndex={-1}
            onClick={handleFechar}
            className="absolute inset-0 cursor-default"
          />
        )}

        <div
          ref={painelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={idTitulo}
          tabIndex={-1}
          className={
            ehDesktop
              ? "relative flex flex-col w-full max-w-lg max-h-[90vh] bg-white rounded-app border border-borda shadow-xl overflow-hidden outline-none"
              : "relative flex flex-col flex-1 min-h-0 outline-none"
          }
        >
          {ehDesktop ? (
            <div className="flex items-start justify-between gap-3 px-5 pt-[18px] pb-1 flex-shrink-0">
              <div className="min-w-0">
                <h2 id={idTitulo} className="font-heading text-[17px] font-semibold truncate">
                  {titulo}
                </h2>
                {descricao && <p className="text-[12.5px] text-cinza mt-0.5">{descricao}</p>}
              </div>
              <BotaoIcone rotulo="Fechar" onClick={handleFechar}>
                {iconeX}
              </BotaoIcone>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-verde-escuro text-white px-2 py-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handleFechar}
                className="flex items-center gap-1 min-h-[48px] px-3 rounded-lg text-[15px] font-medium cursor-pointer hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <span className="w-5 h-5 flex-shrink-0">{iconeChevronEsquerda}</span>
                Voltar
              </button>
              <h2 id={idTitulo} className="font-heading text-[15.5px] font-semibold truncate min-w-0">
                {titulo}
              </h2>
            </div>
          )}

          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overscroll-contain scroll-fino">
            {!ehDesktop && descricao && <p className="px-5 pt-4 text-[13px] text-cinza">{descricao}</p>}
            <ContextoOverlay.Provider value={handleFechar}>{children}</ContextoOverlay.Provider>
          </div>
        </div>
      </div>
      {dialogo}
    </>,
    document.body,
  );
}
