export const TRILHA = "relative grid rounded-lg bg-palha-escura p-[3px]";

export const INDICADOR =
  "pointer-events-none absolute top-[3px] bottom-[3px] left-[3px] rounded-md bg-white " +
  "shadow-[0_1px_2px_rgba(38,36,31,0.12)] transition-transform duration-200 ease-out motion-reduce:transition-none";

export const SEGMENTO =
  "relative z-10 flex items-center justify-center min-w-0 min-h-[44px] md:min-h-0 " +
  "px-2 sm:px-[14px] py-[10px] md:py-[7px] text-[13px] rounded-md cursor-pointer " +
  "transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-verde-claro";

export function classesSegmento(ehSelecionado: boolean): string {
  return `${SEGMENTO} ${ehSelecionado ? "text-tinta font-medium" : "text-cinza hover:text-tinta"}`;
}

export function estiloTrilha(quantidade: number) {
  return { gridTemplateColumns: `repeat(${quantidade}, minmax(0, 1fr))` };
}

export function estiloIndicador(quantidade: number, indiceSelecionado: number) {
  return {
    width: `calc((100% - 6px) / ${quantidade})`,
    transform: `translateX(${indiceSelecionado * 100}%)`,
  };
}

export function indicePorTecla(tecla: string, indiceAtual: number, total: number): number | null {
  if (tecla === "ArrowRight" || tecla === "ArrowDown") return (indiceAtual + 1) % total;
  if (tecla === "ArrowLeft" || tecla === "ArrowUp") return (indiceAtual - 1 + total) % total;
  if (tecla === "Home") return 0;
  if (tecla === "End") return total - 1;
  return null;
}
