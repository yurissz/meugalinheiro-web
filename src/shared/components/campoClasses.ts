/*
 * Classes dos controles de formulário, em arquivo próprio (sem componentes) para que
 * `Campo.tsx` exporte só componentes — o Fast Refresh do Vite desliga num arquivo que
 * mistura componentes com outras exportações.
 *
 * As duas garantias que estas classes carregam:
 *  - 16px no celular: abaixo disso o Safari do iPhone dá zoom ao focar e joga o
 *    formulário pra fora da tela. 13.5px a partir do tablet, pela densidade do layout.
 *  - área de toque: py-3 (≈46px de altura) no celular, mais compacto no desktop.
 */

export const classesRotulo = "block text-[13px] md:text-[12.5px] text-cinza font-medium mb-[5px]";

export function classesControle(temErro = false): string {
  return [
    "w-full rounded-lg border outline-none transition-colors",
    "text-[16px] md:text-[13.5px]",
    "px-3 py-3 md:py-[10px]",
    temErro
      ? "border-terra focus:border-terra focus:ring-[3px] focus:ring-terra-bg"
      : "border-borda focus:border-verde focus:ring-[3px] focus:ring-verde-claro",
  ].join(" ");
}
