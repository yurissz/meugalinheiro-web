interface PaginacaoProps {
  pagina: number;
  totalPaginas: number;
  totalElementos: number;
  aoAnterior: () => void;
  aoProximo: () => void;
  aoIrParaPrimeira: () => void;
  aoIrParaUltima: () => void;
  carregando?: boolean;
}

const classesBotao =
  "px-[10px] py-[10px] md:py-[6px] min-h-[40px] md:min-h-0 rounded-md border border-borda text-cinza cursor-pointer hover:border-cinza-claro disabled:opacity-40 disabled:cursor-not-allowed";

export function Paginacao({
  pagina,
  totalPaginas,
  totalElementos,
  aoAnterior,
  aoProximo,
  aoIrParaPrimeira,
  aoIrParaUltima,
  carregando = false,
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  const naPrimeira = pagina === 0;
  const naUltima = pagina >= totalPaginas - 1;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-3 text-[12.5px] text-cinza">
      <span>
        Página {pagina + 1} de {totalPaginas} · {totalElementos} registro{totalElementos === 1 ? "" : "s"}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={aoIrParaPrimeira} disabled={naPrimeira || carregando} className={classesBotao}>
          « primeira
        </button>
        <button type="button" onClick={aoAnterior} disabled={naPrimeira || carregando} className={classesBotao}>
          ‹ anterior
        </button>
        <button type="button" onClick={aoProximo} disabled={naUltima || carregando} className={classesBotao}>
          próxima ›
        </button>
        <button type="button" onClick={aoIrParaUltima} disabled={naUltima || carregando} className={classesBotao}>
          última »
        </button>
      </div>
    </div>
  );
}
