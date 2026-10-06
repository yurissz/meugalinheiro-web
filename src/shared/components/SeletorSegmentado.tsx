import { useRef, type KeyboardEvent } from "react";
import { classesSegmento, estiloIndicador, estiloTrilha, INDICADOR, indicePorTecla, TRILHA } from "./segmentado";

interface OpcaoSegmentada<T extends string> {
  valor: T;
  rotulo: string;
}

interface SeletorSegmentadoProps<T extends string> {
  rotulo: string;
  opcoes: OpcaoSegmentada<T>[];
  valor: T;
  onChange: (valor: T) => void;
  className?: string;
}

export function SeletorSegmentado<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
  className = "",
}: SeletorSegmentadoProps<T>) {
  const referenciaTrilha = useRef<HTMLDivElement>(null);
  const indiceSelecionado = Math.max(
    0,
    opcoes.findIndex((opcao) => opcao.valor === valor),
  );

  function handleTecla(evento: KeyboardEvent<HTMLDivElement>) {
    const proximo = indicePorTecla(evento.key, indiceSelecionado, opcoes.length);
    if (proximo === null) return;

    const alvo = opcoes[proximo];
    if (!alvo) return;

    evento.preventDefault();
    onChange(alvo.valor);
    referenciaTrilha.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[proximo]?.focus();
  }

  return (
    <div
      ref={referenciaTrilha}
      role="radiogroup"
      aria-label={rotulo}
      onKeyDown={handleTecla}
      className={`${TRILHA} ${className}`}
      style={estiloTrilha(opcoes.length)}
    >
      <div aria-hidden="true" className={INDICADOR} style={estiloIndicador(opcoes.length, indiceSelecionado)} />
      {opcoes.map((opcao) => {
        const ehSelecionada = opcao.valor === valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            role="radio"
            aria-checked={ehSelecionada}
            tabIndex={ehSelecionada ? 0 : -1}
            onClick={() => onChange(opcao.valor)}
            className={classesSegmento(ehSelecionada)}
          >
            <span className="truncate">{opcao.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}
