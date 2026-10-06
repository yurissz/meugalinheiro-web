import { useId, useState, type ReactNode } from "react";
import { iconeChevronBaixo } from "../../../shared/icons";
import { classesContador, classesContadorPorTom, classesMoldura, classesTitulo, type TomSecao } from "./secaoClasses";

interface SecaoRecolhivelProps {
  titulo: string;
  quantidade: number;
  tom: TomSecao;
  abertaInicialmente: boolean;
  vazio: ReactNode;
  rodape?: ReactNode;
  children: ReactNode;
}

export function SecaoRecolhivel({
  titulo,
  quantidade,
  tom,
  abertaInicialmente,
  vazio,
  rodape,
  children,
}: SecaoRecolhivelProps) {
  const idConteudo = useId();
  const [aberta, setAberta] = useState(abertaInicialmente);

  return (
    <section className={classesMoldura}>
      <h3>
        <button
          type="button"
          onClick={() => setAberta((atual) => !atual)}
          aria-expanded={aberta}
          aria-controls={idConteudo}
          className="w-full flex items-center gap-2 px-[14px] py-3 min-h-[48px] md:min-h-0 text-left cursor-pointer hover:bg-[#FBF8F0] transition-colors"
        >
          <span className={classesTitulo}>{titulo}</span>
          <span className={`${classesContador} ${classesContadorPorTom[tom]}`}>{quantidade}</span>
          <span
            aria-hidden="true"
            className={`ml-auto text-cinza-claro transition-transform duration-200 ${aberta ? "rotate-180" : ""}`}
          >
            {iconeChevronBaixo}
          </span>
        </button>
      </h3>
      <div id={idConteudo} hidden={!aberta}>
        {quantidade === 0 ? (
          <p className="px-[14px] pb-4 pt-1 text-[13px] text-cinza-claro">{vazio}</p>
        ) : (
          <ul className="border-t border-borda">{children}</ul>
        )}
        {rodape && <div className="border-t border-borda px-[14px] py-3">{rodape}</div>}
      </div>
    </section>
  );
}
