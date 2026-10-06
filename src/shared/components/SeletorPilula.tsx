import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { iconeBusca, iconeCheck, iconeChevronBaixo } from "../icons";
import { indicePorTecla } from "./segmentado";

export interface OpcaoPilula<T extends string> {
  valor: T;
  rotulo: string;
}

interface SeletorPilulaProps<T extends string> {
  rotulo: string;
  opcoes: OpcaoPilula<T>[];
  valor: T;
  onChange: (valor: T) => void;
  vazio?: string;
  className?: string;
}

const MINIMO_PARA_BUSCA = 8;

const TECLAS_QUE_ABREM = ["Enter", " ", "ArrowDown", "ArrowUp"];

/*
 * Antes a lista tinha altura máxima fixa (280px). Com 8 opções de 45px no celular ela
 * cortava as duas últimas — e sobrava viewport embaixo, ou seja, o corte era gratuito.
 * Agora o limite é o espaço que existe de fato até a borda da tela, e o painel sobe
 * quando embaixo é apertado demais.
 */
const MARGEM_DA_BORDA = 12;
const ALTURA_MINIMA = 160;

interface PosicaoDoPainel {
  paraCima: boolean;
  alturaMaxima: number;
}

const POSICAO_INICIAL: PosicaoDoPainel = { paraCima: false, alturaMaxima: 280 };

export function SeletorPilula<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
  vazio = "Nenhuma opção disponível",
  className = "",
}: SeletorPilulaProps<T>) {
  const idBase = useId();
  const referenciaRaiz = useRef<HTMLDivElement>(null);
  const referenciaGatilho = useRef<HTMLButtonElement>(null);
  const referenciaBusca = useRef<HTMLInputElement>(null);
  const referenciaLista = useRef<HTMLUListElement>(null);

  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [indiceRealcado, setIndiceRealcado] = useState(0);
  const [posicao, setPosicao] = useState<PosicaoDoPainel>(POSICAO_INICIAL);

  const temBusca = opcoes.length > MINIMO_PARA_BUSCA;
  const termo = busca.trim().toLowerCase();
  const filtradas = termo ? opcoes.filter((opcao) => opcao.rotulo.toLowerCase().includes(termo)) : opcoes;
  const realcado = Math.min(indiceRealcado, Math.max(0, filtradas.length - 1));
  const selecionada = opcoes.find((opcao) => opcao.valor === valor);
  const rotuloSelecionado = selecionada?.rotulo ?? "—";

  useLayoutEffect(() => {
    if (!aberto) return;

    function medirEspacoDisponivel() {
      const gatilho = referenciaGatilho.current;
      if (!gatilho) return;

      const retangulo = gatilho.getBoundingClientRect();
      const espacoAbaixo = window.innerHeight - retangulo.bottom - MARGEM_DA_BORDA;
      const espacoAcima = retangulo.top - MARGEM_DA_BORDA;
      const paraCima = espacoAbaixo < ALTURA_MINIMA && espacoAcima > espacoAbaixo;

      // O teto é o espaço que existe do lado escolhido, nunca um mínimo forçado: forçar
      // altura onde ela não cabe era o que empurrava o painel pra fora da tela.
      setPosicao({ paraCima, alturaMaxima: Math.max(0, paraCima ? espacoAcima : espacoAbaixo) });
    }

    medirEspacoDisponivel();
    window.addEventListener("resize", medirEspacoDisponivel);
    window.addEventListener("scroll", medirEspacoDisponivel, true);
    return () => {
      window.removeEventListener("resize", medirEspacoDisponivel);
      window.removeEventListener("scroll", medirEspacoDisponivel, true);
    };
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    // preventScroll: focar a lista fazia o navegador rolar a página, o que movia o
    // gatilho debaixo do painel já posicionado e deixava a tela pulando ao selecionar.
    (referenciaBusca.current ?? referenciaLista.current)?.focus({ preventScroll: true });

    function handleForaDoSeletor(evento: PointerEvent) {
      if (referenciaRaiz.current?.contains(evento.target as Node)) return;
      setAberto(false);
    }

    document.addEventListener("pointerdown", handleForaDoSeletor);
    return () => document.removeEventListener("pointerdown", handleForaDoSeletor);
  }, [aberto]);

  function abrir() {
    setBusca("");
    setIndiceRealcado(Math.max(0, opcoes.findIndex((opcao) => opcao.valor === valor)));
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    referenciaGatilho.current?.focus({ preventScroll: true });
  }

  function escolher(opcao: OpcaoPilula<T>) {
    onChange(opcao.valor);
    setAberto(false);
    referenciaGatilho.current?.focus({ preventScroll: true });
  }

  function handleTeclaGatilho(evento: KeyboardEvent<HTMLButtonElement>) {
    if (!TECLAS_QUE_ABREM.includes(evento.key)) return;
    evento.preventDefault();
    abrir();
  }

  function handleTeclaPainel(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === "Escape" || evento.key === "Tab") {
      evento.preventDefault();
      fechar();
      return;
    }

    if (evento.key === "Enter") {
      evento.preventDefault();
      if (filtradas[realcado]) escolher(filtradas[realcado]);
      return;
    }

    if (filtradas.length === 0) return;

    const proximo = indicePorTecla(evento.key, realcado, filtradas.length);
    if (proximo === null) return;

    evento.preventDefault();
    setIndiceRealcado(proximo);
  }

  return (
    <div ref={referenciaRaiz} className={`relative inline-block max-w-full ${className}`}>
      <button
        ref={referenciaGatilho}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={`${rotulo}: ${rotuloSelecionado}`}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={handleTeclaGatilho}
        className="inline-flex items-center gap-2 max-w-full min-h-[44px] md:min-h-0 px-[14px] py-[9px] md:py-[7px] rounded-full border border-borda bg-white text-[14px] md:text-[13px] cursor-pointer transition-colors hover:border-cinza-claro outline-none focus-visible:border-verde focus-visible:ring-[3px] focus-visible:ring-verde-claro"
      >
        <span className="text-cinza flex-shrink-0">{rotulo}</span>
        <span className="font-semibold text-tinta truncate">{rotuloSelecionado}</span>
        <span className="text-cinza-claro flex-shrink-0">{iconeChevronBaixo}</span>
      </button>

      {aberto && (
        <div
          onKeyDown={handleTeclaPainel}
          style={{ maxHeight: posicao.alturaMaxima }}
          className={`absolute z-20 left-0 min-w-full w-max max-w-[min(320px,calc(100vw-40px))] flex flex-col bg-white border border-borda rounded-app shadow-[0_8px_28px_rgba(38,36,31,0.18)] overflow-hidden ${
            posicao.paraCima ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {temBusca && (
            <div className="relative border-b border-[#F0EBDD] flex-shrink-0">
              <span className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2 text-cinza-claro">
                {iconeBusca}
              </span>
              <input
                ref={referenciaBusca}
                value={busca}
                onChange={(evento) => {
                  setBusca(evento.target.value);
                  setIndiceRealcado(0);
                }}
                placeholder={`Buscar ${rotulo.toLowerCase()}...`}
                aria-label={`Buscar ${rotulo.toLowerCase()}`}
                aria-controls={`${idBase}-lista`}
                aria-activedescendant={filtradas[realcado] ? `${idBase}-opcao-${realcado}` : undefined}
                autoComplete="off"
                className="w-full text-[16px] md:text-[13.5px] pl-9 pr-3 py-3 md:py-2 outline-none"
              />
            </div>
          )}

          <ul
            ref={referenciaLista}
            id={`${idBase}-lista`}
            role="listbox"
            aria-label={rotulo}
            tabIndex={temBusca ? -1 : 0}
            aria-activedescendant={filtradas[realcado] ? `${idBase}-opcao-${realcado}` : undefined}
            className="flex-1 min-h-0 overflow-y-auto scroll-fino outline-none"
          >
            {filtradas.length === 0 ? (
              <li className="px-3 py-3 text-[13px] text-cinza-claro">{vazio}</li>
            ) : (
              filtradas.map((opcao, indice) => {
                const ehSelecionada = opcao.valor === valor;
                return (
                  <li
                    key={opcao.valor}
                    id={`${idBase}-opcao-${indice}`}
                    role="option"
                    aria-selected={ehSelecionada}
                    onClick={() => escolher(opcao)}
                    onPointerMove={() => setIndiceRealcado(indice)}
                    className={`flex items-center gap-2 px-3 min-h-[44px] md:min-h-0 py-[11px] md:py-[7px] text-[15px] md:text-[13.5px] cursor-pointer ${
                      indice === realcado ? "bg-palha-escura" : ""
                    } ${ehSelecionada ? "font-medium text-tinta" : "text-cinza"}`}
                  >
                    <span className={`flex-shrink-0 ${ehSelecionada ? "text-verde" : "invisible"}`}>{iconeCheck}</span>
                    <span className="truncate">{opcao.rotulo}</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
