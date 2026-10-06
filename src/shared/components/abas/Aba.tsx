import type { ReactNode } from "react";
import { classesSegmento } from "../segmentado";
import { idDaAba, idDoPainel, useContextoAbas } from "./contextoAbas";

export interface AbaProps {
  valor: string;
  children: ReactNode;
}

export function Aba({ valor, children }: AbaProps) {
  const { valorSelecionado, idBase, selecionar } = useContextoAbas();
  const ehSelecionada = valor === valorSelecionado;

  return (
    <button
      type="button"
      role="tab"
      id={idDaAba(idBase, valor)}
      aria-selected={ehSelecionada}
      aria-controls={idDoPainel(idBase, valor)}
      tabIndex={ehSelecionada ? 0 : -1}
      onClick={() => selecionar(valor)}
      className={classesSegmento(ehSelecionada)}
    >
      <span className="truncate">{children}</span>
    </button>
  );
}
