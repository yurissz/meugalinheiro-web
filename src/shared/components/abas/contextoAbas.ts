import { createContext, useContext } from "react";

export interface ValorContextoAbas {
  valorSelecionado: string;
  idBase: string;
  selecionar: (valor: string) => void;
}

export const ContextoAbas = createContext<ValorContextoAbas | null>(null);

export function useContextoAbas(): ValorContextoAbas {
  const contexto = useContext(ContextoAbas);
  if (!contexto) throw new Error("<Aba>, <ListaAbas> e <PainelAba> precisam estar dentro de <Abas>.");
  return contexto;
}

export function idDaAba(idBase: string, valor: string): string {
  return `${idBase}-aba-${valor}`;
}

export function idDoPainel(idBase: string, valor: string): string {
  return `${idBase}-painel-${valor}`;
}
