import type { SelectHTMLAttributes } from "react";
import { iconeChevronBaixo } from "../icons";

type SeletorNativoProps = SelectHTMLAttributes<HTMLSelectElement>;

/** <select> nativo com seta customizada — a seta padrão do navegador destoa do resto dos inputs. */
export function SeletorNativo({ className = "", ...props }: SeletorNativoProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        className="w-full appearance-none text-[16px] md:text-[13.5px] pl-3 pr-8 py-3 md:py-[9px] border border-borda rounded-lg outline-none focus:border-verde focus:ring-[3px] focus:ring-verde-claro bg-white cursor-pointer"
        {...props}
      />
      <span className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2 text-cinza-claro">{iconeChevronBaixo}</span>
    </div>
  );
}
