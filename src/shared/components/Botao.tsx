import type { ComponentProps } from "react";

type Variante = "primary" | "secundario" | "inverso" | "perigo";

interface BotaoProps extends ComponentProps<"button"> {
  variante?: Variante;
}

/*
 * Altura mínima de 44px no celular (recomendação de alvo de toque) e a densidade menor
 * do layout a partir do tablet. O público usa isso em pé, com a mão suja de ração — botão
 * de 34px é alvo demais pra errar.
 */
const classesBase =
  "inline-flex items-center justify-center font-sans text-[13.5px] md:text-[13px] px-[18px] " +
  "min-h-[44px] md:min-h-0 py-[10px] rounded-lg border transition-colors cursor-pointer " +
  "disabled:opacity-60 disabled:cursor-not-allowed";

const classesPorVariante: Record<Variante, string> = {
  primary: "bg-verde border-verde text-white font-medium hover:bg-verde-escuro",
  secundario: "bg-white border-borda text-tinta hover:border-cinza-claro",
  // Pro CTA principal quando o fundo já é verde (dentro do CabecalhoPagina) — inverte
  // as cores pra continuar com contraste, já que "primary" sumiria no próprio fundo.
  inverso: "bg-white border-white text-verde font-medium hover:bg-palha",
  perigo: "bg-terra border-terra text-white font-medium hover:bg-[#8f3a22]",
};

/**
 * `type="button"` é o padrão de propósito: o padrão do HTML é "submit", e um botão de
 * ação esquecido dentro de um <form> acabava enviando o formulário sem querer.
 */
export function Botao({ variante = "secundario", className = "", type = "button", ...props }: BotaoProps) {
  return <button type={type} className={`${classesBase} ${classesPorVariante[variante]} ${className}`} {...props} />;
}
