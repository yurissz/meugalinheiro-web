import { useEffect, useRef, type RefObject } from "react";
import { useEhDesktop } from "../../hooks/useEhDesktop";

const SELETOR_FOCAVEIS =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const SELETOR_PRIMEIRO_CAMPO = 'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';

interface OpcoesOverlayFormulario {
  temAlteracoes: boolean;
  /** Chamada quando o fechamento já está decidido (não precisa confirmar nada). */
  aoFechar: () => void;
  /** Deve resolver `true` pra confirmar o descarte do que foi digitado. */
  aoPedirConfirmacao: () => Promise<boolean>;
}

interface ResultadoOverlayFormulario {
  painelRef: RefObject<HTMLDivElement | null>;
  ehDesktop: boolean;
  solicitarFechamento: () => Promise<void>;
}

function focaveisDe(painel: HTMLElement | null): HTMLElement[] {
  if (!painel) return [];
  return [...painel.querySelectorAll<HTMLElement>(SELETOR_FOCAVEIS)].filter((elemento) => elemento.offsetParent !== null);
}

/**
 * Comportamento do formulário em overlay: foco, trap de Tab, Esc e scroll travado no
 * fundo. Montar o hook abre; desmontar fecha.
 *
 * O overlay não troca de rota de propósito — a tela de origem continua montada, então
 * filtros, página da listagem e posição de scroll ficam intactos sem precisar restaurar
 * nada. A saída é sempre por um controle visível (← Voltar no celular, ✕ no desktop),
 * além de Esc, Cancelar e clique no fundo.
 */
export function useOverlayFormulario({
  temAlteracoes,
  aoFechar,
  aoPedirConfirmacao,
}: OpcoesOverlayFormulario): ResultadoOverlayFormulario {
  const painelRef = useRef<HTMLDivElement | null>(null);
  const confirmandoRef = useRef(false);
  // Fechar desfaz uma entrada do histórico: dois Esc seguidos voltariam duas telas.
  const fechandoRef = useRef(false);
  const ehDesktop = useEhDesktop();

  const atualRef = useRef({ temAlteracoes, aoFechar, aoPedirConfirmacao });
  const solicitarFechamentoRef = useRef<() => Promise<void>>(async () => {});

  function fechar() {
    if (fechandoRef.current) return;
    fechandoRef.current = true;
    atualRef.current.aoFechar();
  }

  async function fecharComConfirmacao() {
    if (confirmandoRef.current || fechandoRef.current) return;
    if (!atualRef.current.temAlteracoes) {
      fechar();
      return;
    }

    const focoAnterior = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    confirmandoRef.current = true;
    try {
      if (await atualRef.current.aoPedirConfirmacao()) {
        fechar();
        return;
      }
    } finally {
      confirmandoRef.current = false;
    }
    // Sem isso o foco fica no botão do diálogo que acabou de sair do DOM, ou seja, no body.
    (focoAnterior ?? painelRef.current)?.focus();
  }

  useEffect(() => {
    atualRef.current = { temAlteracoes, aoFechar, aoPedirConfirmacao };
    solicitarFechamentoRef.current = fecharComConfirmacao;
  });

  useEffect(() => {
    const disparador = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const primeiroCampo = painelRef.current?.querySelector<HTMLElement>(SELETOR_PRIMEIRO_CAMPO);
    (primeiroCampo ?? painelRef.current)?.focus();
    return () => disparador?.focus();
  }, []);

  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, []);

  useEffect(() => {
    function aoTeclar(evento: KeyboardEvent) {
      if (confirmandoRef.current) return;

      if (evento.key === "Escape") {
        evento.preventDefault();
        // O diálogo de descarte monta o próprio listener de Esc já durante este keydown e
        // se cancelaria sozinho na fase de bubble. Com o overlay aberto o Esc é nosso;
        // quando o diálogo já está de pé, caímos no `return` acima e o Esc vai pra ele.
        evento.stopImmediatePropagation();
        void solicitarFechamentoRef.current();
        return;
      }

      if (evento.key !== "Tab") return;

      const focaveis = focaveisDe(painelRef.current);
      const primeiro = focaveis.at(0);
      const ultimo = focaveis.at(-1);
      if (!primeiro || !ultimo) return;

      const ativo = document.activeElement;
      const dentroDoPainel = ativo instanceof Node && Boolean(painelRef.current?.contains(ativo));

      if (evento.shiftKey && (ativo === primeiro || !dentroDoPainel)) {
        evento.preventDefault();
        ultimo.focus();
        return;
      }
      if (!evento.shiftKey && (ativo === ultimo || !dentroDoPainel)) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoTeclar, true);
    return () => document.removeEventListener("keydown", aoTeclar, true);
  }, []);

  return { painelRef, ehDesktop, solicitarFechamento: () => solicitarFechamentoRef.current() };
}
