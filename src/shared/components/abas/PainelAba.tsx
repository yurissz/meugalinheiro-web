import type { ReactNode } from "react";
import { idDaAba, idDoPainel, useContextoAbas } from "./contextoAbas";

interface PainelAbaProps {
  valor: string;
  children: ReactNode;
}

export function PainelAba({ valor, children }: PainelAbaProps) {
  const { valorSelecionado, idBase } = useContextoAbas();

  if (valor !== valorSelecionado) return null;

  return (
    <div role="tabpanel" id={idDoPainel(idBase, valor)} aria-labelledby={idDaAba(idBase, valor)}>
      {children}
    </div>
  );
}
