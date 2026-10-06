import { SeletorPilula, type OpcaoPilula } from "../../shared/components/SeletorPilula";
import type { LoteResponse } from "./types";

interface FiltroLoteProps {
  lotes: LoteResponse[];
  valor: string;
  onChange: (id: string) => void;
  opcaoTodos?: string;
  className?: string;
}

export function FiltroLote({ lotes, valor, onChange, opcaoTodos, className }: FiltroLoteProps) {
  const opcoesDeLote: OpcaoPilula<string>[] = lotes.map((lote) => ({ valor: lote.id, rotulo: lote.nome }));
  const opcoes = opcaoTodos ? [{ valor: "", rotulo: opcaoTodos }, ...opcoesDeLote] : opcoesDeLote;

  return (
    <SeletorPilula
      rotulo="Lote"
      opcoes={opcoes}
      valor={valor}
      onChange={onChange}
      vazio="Nenhum lote encontrado"
      className={className}
    />
  );
}
