import { iconeOlho, iconeOlhoFechado } from "../icons";

interface BotaoVisibilidadeProps {
  visivel: boolean;
  onClick: () => void;
  className?: string;
  /** Usa cores claras — pro botão viver dentro do CabecalhoPagina (fundo verde). */
  escuro?: boolean;
}

/** Alterna a exibição de valores sensíveis (lucro, receitas...) entre reais e "****". */
export function BotaoVisibilidade({ visivel, onClick, className = "", escuro }: BotaoVisibilidadeProps) {
  const classesTema = escuro
    ? "border-white/30 text-white/85 hover:text-white hover:border-white/60 hover:bg-white/15"
    : "border-borda text-cinza hover:text-tinta hover:border-cinza-claro hover:bg-palha-escura";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={visivel ? "Ocultar valores" : "Mostrar valores"}
      title={visivel ? "Ocultar valores" : "Mostrar valores"}
      className={`inline-flex items-center justify-center w-11 h-11 md:w-8 md:h-8 flex-shrink-0 rounded-md border transition-colors cursor-pointer ${classesTema} ${className}`}
    >
      {visivel ? iconeOlho : iconeOlhoFechado}
    </button>
  );
}
