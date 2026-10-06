import type { ReactNode } from "react";
import { iconeFiltro, iconeX } from "../icons";

interface PainelTabelaProps {
  filtros: ReactNode;
  children: ReactNode;
  temFiltrosAtivos?: boolean;
  aoLimpar?: () => void;
  className?: string;
}

export const LISTA_NO_MOBILE = "flex flex-col md:hidden";

export const LINHA_NO_MOBILE = "px-[14px] py-[13px] border-b border-[#F0EBDD] last:border-b-0";

export function PainelTabela({ filtros, children, temFiltrosAtivos, aoLimpar, className = "" }: PainelTabelaProps) {
  return (
    <div className={`bg-white border border-borda rounded-app overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-x-[10px] border-b border-borda px-[14px] py-[12px] sm:py-[11px]">
        <span className="hidden sm:flex text-cinza-claro flex-shrink-0" aria-hidden="true">
          {iconeFiltro}
        </span>
        {filtros}
        {temFiltrosAtivos && aoLimpar && (
          <button
            type="button"
            onClick={aoLimpar}
            className="flex items-center justify-center sm:inline-flex sm:justify-start gap-1 text-[12.5px] text-cinza hover:text-terra cursor-pointer flex-shrink-0 whitespace-nowrap transition-colors pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0EBDD] sm:ml-auto"
          >
            {iconeX}
            Limpar filtros
          </button>
        )}
      </div>
      <div className="pt-3 md:pt-0">{children}</div>
    </div>
  );
}
