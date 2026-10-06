import { Children, isValidElement, useRef, type KeyboardEvent, type ReactElement, type ReactNode } from "react";
import { estiloIndicador, estiloTrilha, INDICADOR, indicePorTecla, TRILHA } from "../segmentado";
import { Aba, type AbaProps } from "./Aba";
import { useContextoAbas } from "./contextoAbas";

interface ListaAbasProps {
  rotulo: string;
  children: ReactNode;
  className?: string;
}

function valoresDasAbas(children: ReactNode): string[] {
  return Children.toArray(children)
    .filter((filho): filho is ReactElement<AbaProps> => isValidElement(filho) && filho.type === Aba)
    .map((filho) => filho.props.valor);
}

export function ListaAbas({ rotulo, children, className = "" }: ListaAbasProps) {
  const { valorSelecionado, selecionar } = useContextoAbas();
  const referenciaTrilha = useRef<HTMLDivElement>(null);

  const valores = valoresDasAbas(children);
  const indiceSelecionado = Math.max(0, valores.indexOf(valorSelecionado));

  function handleTecla(evento: KeyboardEvent<HTMLDivElement>) {
    const proximo = indicePorTecla(evento.key, indiceSelecionado, valores.length);
    if (proximo === null) return;

    const alvo = valores[proximo];
    if (alvo === undefined) return;

    evento.preventDefault();
    selecionar(alvo);
    referenciaTrilha.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[proximo]?.focus();
  }

  return (
    <div
      ref={referenciaTrilha}
      role="tablist"
      aria-label={rotulo}
      onKeyDown={handleTecla}
      className={`${TRILHA} ${className}`}
      style={estiloTrilha(valores.length)}
    >
      <div aria-hidden="true" className={INDICADOR} style={estiloIndicador(valores.length, indiceSelecionado)} />
      {children}
    </div>
  );
}
