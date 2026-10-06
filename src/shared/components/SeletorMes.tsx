import { nomeMes } from "../format";
import { iconeChevronDireita, iconeChevronEsquerda } from "../icons";

interface SeletorMesProps {
  ano: number;
  mes: number;
  onChange: (anoMes: { ano: number; mes: number }) => void;
  className?: string;
  /** Usa cores claras nos botões — pro seletor viver dentro do CabecalhoPagina (fundo verde). */
  escuro?: boolean;
}

/** Alterna mês/ano um de cada vez, tratando a virada de ano nas duas pontas (jan ↔ dez). */
export function SeletorMes({ ano, mes, onChange, className = "", escuro }: SeletorMesProps) {
  function mudar(delta: number) {
    const novoMes = mes + delta;
    if (novoMes < 1) onChange({ ano: ano - 1, mes: 12 });
    else if (novoMes > 12) onChange({ ano: ano + 1, mes: 1 });
    else onChange({ ano, mes: novoMes });
  }

  const classesBotao = escuro
    ? "flex items-center justify-center w-9 h-9 md:w-7 md:h-7 rounded-full text-white/80 hover:text-white hover:bg-white/15 cursor-pointer transition-colors"
    : "flex items-center justify-center w-9 h-9 md:w-7 md:h-7 rounded-full text-cinza hover:text-tinta hover:bg-palha-escura cursor-pointer transition-colors";

  return (
    <div className={`inline-flex items-center gap-[2px] ${className}`}>
      <button type="button" onClick={() => mudar(-1)} aria-label="Mês anterior" className={classesBotao}>
        {iconeChevronEsquerda}
      </button>
      <span className="min-w-[112px] text-center">
        {nomeMes(mes)} de {ano}
      </span>
      <button type="button" onClick={() => mudar(1)} aria-label="Próximo mês" className={classesBotao}>
        {iconeChevronDireita}
      </button>
    </div>
  );
}
