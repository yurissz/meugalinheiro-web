import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { iconeMaisAcoes } from "../icons";

export interface ItemMenuAcoes {
  rotulo: string;
  icone?: ReactNode;
  destrutivo?: boolean;
  aoEscolher: () => void;
}

interface MenuAcoesProps {
  rotulo: string;
  itens: ItemMenuAcoes[];
  className?: string;
}

const TECLAS_QUE_ABREM = ["Enter", " ", "ArrowDown", "ArrowUp"];

export function MenuAcoes({ rotulo, itens, className = "" }: MenuAcoesProps) {
  const idBase = useId();
  const referenciaRaiz = useRef<HTMLDivElement>(null);
  const referenciaGatilho = useRef<HTMLButtonElement>(null);
  const referenciaItens = useRef<(HTMLButtonElement | null)[]>([]);

  const [aberto, setAberto] = useState(false);
  const [realcado, setRealcado] = useState(0);

  useEffect(() => {
    if (!aberto) return;

    referenciaItens.current[realcado]?.focus();

    function handleForaDoMenu(evento: PointerEvent) {
      if (referenciaRaiz.current?.contains(evento.target as Node)) return;
      setAberto(false);
    }

    document.addEventListener("pointerdown", handleForaDoMenu);
    return () => document.removeEventListener("pointerdown", handleForaDoMenu);
  }, [aberto, realcado]);

  function abrir(indiceInicial: number) {
    setRealcado(indiceInicial);
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    referenciaGatilho.current?.focus();
  }

  function escolher(item: ItemMenuAcoes) {
    setAberto(false);
    referenciaGatilho.current?.focus();
    item.aoEscolher();
  }

  function handleTeclaGatilho(evento: KeyboardEvent<HTMLButtonElement>) {
    if (!TECLAS_QUE_ABREM.includes(evento.key)) return;
    evento.preventDefault();
    abrir(evento.key === "ArrowUp" ? itens.length - 1 : 0);
  }

  function handleTeclaMenu(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape" || evento.key === "Tab") {
      evento.preventDefault();
      fechar();
      return;
    }
    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setRealcado((atual) => (atual + 1) % itens.length);
      return;
    }
    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setRealcado((atual) => (atual - 1 + itens.length) % itens.length);
      return;
    }
    if (evento.key === "Home") {
      evento.preventDefault();
      setRealcado(0);
      return;
    }
    if (evento.key === "End") {
      evento.preventDefault();
      setRealcado(itens.length - 1);
    }
  }

  if (itens.length === 0) return null;

  return (
    <div ref={referenciaRaiz} className={`relative flex-shrink-0 ${className}`}>
      <button
        ref={referenciaGatilho}
        type="button"
        aria-label={rotulo}
        title={rotulo}
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={aberto ? `${idBase}-menu` : undefined}
        onClick={() => (aberto ? fechar() : abrir(0))}
        onKeyDown={handleTeclaGatilho}
        className="inline-flex items-center justify-center w-11 h-11 md:w-8 md:h-8 rounded-md text-cinza hover:text-tinta hover:bg-palha-escura transition-colors cursor-pointer outline-none focus-visible:ring-[3px] focus-visible:ring-verde-claro"
      >
        {iconeMaisAcoes}
      </button>

      {aberto && (
        <div
          id={`${idBase}-menu`}
          role="menu"
          aria-label={rotulo}
          onKeyDown={handleTeclaMenu}
          className="absolute z-30 right-0 mt-1 min-w-[180px] bg-white border border-borda rounded-app shadow-[0_8px_28px_rgba(38,36,31,0.18)] overflow-hidden py-1"
        >
          {itens.map((item, indice) => (
            <button
              key={item.rotulo}
              ref={(elemento) => {
                referenciaItens.current[indice] = elemento;
              }}
              type="button"
              role="menuitem"
              tabIndex={indice === realcado ? 0 : -1}
              onClick={() => escolher(item)}
              onPointerMove={() => setRealcado(indice)}
              className={`w-full flex items-center gap-2.5 px-3 min-h-[44px] md:min-h-0 md:py-2 text-left text-[15px] md:text-[13.5px] cursor-pointer outline-none ${
                indice === realcado ? "bg-palha-escura" : ""
              } ${item.destrutivo ? "text-terra" : "text-tinta"}`}
            >
              {item.icone && (
                <span aria-hidden="true" className="flex-shrink-0">
                  {item.icone}
                </span>
              )}
              {item.rotulo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
