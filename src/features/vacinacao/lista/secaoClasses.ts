export type TomSecao = "ok" | "warn" | "bad";

export const classesMoldura = "bg-white border border-borda rounded-app overflow-hidden mb-3";

export const classesTitulo = "text-[15px] md:text-[14px] font-semibold";

export const classesContadorPorTom: Record<TomSecao, string> = {
  ok: "bg-verde-claro text-verde",
  warn: "bg-gema-bg text-gema-texto",
  bad: "bg-terra text-white",
};

export const classesContador = "text-[12px] font-semibold px-[9px] py-[2px] rounded-full flex-shrink-0";
