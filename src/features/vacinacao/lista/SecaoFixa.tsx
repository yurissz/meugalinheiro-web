import type { ReactNode } from "react";
import { classesContador, classesContadorPorTom, classesMoldura, classesTitulo, type TomSecao } from "./secaoClasses";

interface SecaoFixaProps {
  titulo: string;
  quantidade: number;
  tom: TomSecao;
  children: ReactNode;
}

export function SecaoFixa({ titulo, quantidade, tom, children }: SecaoFixaProps) {
  return (
    <section className={classesMoldura}>
      <div className="flex items-center gap-2 px-[14px] py-3">
        <h3 className={classesTitulo}>{titulo}</h3>
        <span className={`${classesContador} ${classesContadorPorTom[tom]}`}>{quantidade}</span>
      </div>
      <ul className="border-t border-borda">{children}</ul>
    </section>
  );
}
