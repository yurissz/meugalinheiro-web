import { iconeBusca, iconeX } from "../icons";

interface CampoBuscaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

/** Input de busca com lupa à esquerda e botão de limpar à direita (padrão reconhecível de busca). */
export function CampoBusca({ value, onChange, placeholder, className = "" }: CampoBuscaProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2 text-cinza-claro">{iconeBusca}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[16px] md:text-[13.5px] pl-9 pr-9 py-3 md:py-[9px] border border-borda rounded-lg outline-none focus:border-verde focus:ring-[3px] focus:ring-verde-claro"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="absolute right-[4px] top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 md:w-[22px] md:h-[22px] rounded-full text-cinza-claro hover:text-cinza hover:bg-palha-escura cursor-pointer transition-colors"
        >
          {iconeX}
        </button>
      )}
    </div>
  );
}
