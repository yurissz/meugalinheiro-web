import { useId, type ReactNode } from "react";
import { ContextoAbas } from "./contextoAbas";

interface AbasProps<T extends string> {
  valor: T;
  onChange: (valor: T) => void;
  children: ReactNode;
  className?: string;
}

export function Abas<T extends string>({ valor, onChange, children, className = "" }: AbasProps<T>) {
  const idBase = useId();

  function selecionar(novoValor: string) {
    onChange(novoValor as T);
  }

  return (
    <ContextoAbas.Provider value={{ valorSelecionado: valor, idBase, selecionar }}>
      <div className={className}>{children}</div>
    </ContextoAbas.Provider>
  );
}
