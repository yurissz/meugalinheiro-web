import type { ReactNode } from "react";
import { iconeLogo } from "../icons";

interface CabecalhoPaginaProps {
  titulo: ReactNode;
  subtitulo?: ReactNode;
  acao?: ReactNode;
  /** Só precisa passar se a tela quiser um selo diferente da marca do app. */
  icone?: ReactNode;
  className?: string;
}

/**
 * Banner de topo compartilhado por todas as telas principais — mesmo verde em gradiente,
 * mesma marca d'água da logo e o mesmo selo circular do Novo registro e do Login. É essa
 * moldura repetida (não um ícone diferente por tela) que dá identidade visual única ao app.
 */
export function CabecalhoPagina({ titulo, subtitulo, acao, icone = iconeLogo, className = "" }: CabecalhoPaginaProps) {
  return (
    <div className={`relative overflow-hidden rounded-app bg-gradient-to-br from-verde-escuro to-verde px-6 py-6 mb-6 text-white ${className}`}>
      <svg viewBox="0 0 40 34" aria-hidden="true" className="absolute -right-4 -top-4 w-36 h-32 text-white/10 pointer-events-none">
        <path
          d="M4 32 C4 20 6 12 10 12 C13 12 14 17 14 17 C14 8 17 3 21 3 C25 3 26 9 26 9 C27 4 30 6 32 10 C35 16 36 24 36 32 Z"
          fill="currentColor"
        />
      </svg>
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-gema">
            {icone}
          </div>
          <div className="min-w-0">
            <h1 className="text-[22px] font-heading font-semibold truncate">{titulo}</h1>
            {subtitulo && <div className="text-[13px] text-white/75 mt-1">{subtitulo}</div>}
          </div>
        </div>
        {acao && <div className="w-full sm:w-auto flex-shrink-0">{acao}</div>}
      </div>
    </div>
  );
}
