import { useState } from "react";
import { classesControle } from "../../shared/components/campoClasses";
import type { LoteResponse } from "./types";

interface SeletorLoteProps {
  lotes: LoteResponse[];
  value: string;
  onChange: (id: string) => void;
  /** Rótulo de uma opção "sem lote"; se ausente, um lote precisa ser escolhido. */
  opcaoVazia?: string;
  required?: boolean;
  className?: string;
  /** Id do input, pra amarrar num <label htmlFor>. */
  id?: string;
  erro?: string;
}

const LIMITE_EXIBIDO = 50;

/**
 * Select com busca por texto. Um <select> nativo com centenas de lotes é lento de
 * abrir e impossível de navegar digitando o nome — aqui o usuário filtra antes de
 * escolher, e só renderizamos os primeiros resultados pra não travar a lista.
 */
export function SeletorLote({ lotes, value, onChange, opcaoVazia, required, className = "", id, erro }: SeletorLoteProps) {
  const [aberto, setAberto] = useState(false);
  const [filtro, setFiltro] = useState("");

  const selecionaveis = lotes.filter((lote) => lote.ativo || lote.id === value);
  const loteSelecionado = selecionaveis.find((lote) => lote.id === value);
  const rotuloSelecionado = loteSelecionado?.nome ?? (value === "" ? (opcaoVazia ?? "") : "");

  const termo = filtro.trim().toLowerCase();
  const filtrados = termo ? selecionaveis.filter((lote) => lote.nome.toLowerCase().includes(termo)) : selecionaveis;
  const visiveis = filtrados.slice(0, LIMITE_EXIBIDO);
  const excedente = filtrados.length - visiveis.length;

  function selecionar(id: string) {
    onChange(id);
    setFiltro("");
    setAberto(false);
  }

  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        role="combobox"
        aria-expanded={aberto}
        aria-autocomplete="list"
        aria-invalid={erro ? true : undefined}
        value={aberto ? filtro : rotuloSelecionado}
        onChange={(e) => {
          setFiltro(e.target.value);
          setAberto(true);
        }}
        onFocus={() => {
          setAberto(true);
          setFiltro("");
        }}
        onBlur={() => setAberto(false)}
        placeholder="Buscar lote..."
        className={classesControle(Boolean(erro))}
        required={required && !value}
        autoComplete="off"
      />
      {aberto && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="absolute z-10 mt-1 w-full max-h-[260px] overflow-y-auto scroll-fino bg-white border border-borda rounded-lg shadow-lg"
        >
          {opcaoVazia !== undefined && (
            <button
              type="button"
              onClick={() => selecionar("")}
              className={`block w-full text-left px-3 py-2 text-[13px] hover:bg-palha-escura ${value === "" ? "bg-palha-escura" : ""}`}
            >
              {opcaoVazia}
            </button>
          )}
          {visiveis.length === 0 ? (
            <div className="px-3 py-2 text-[13px] text-cinza-claro">Nenhum lote ativo encontrado.</div>
          ) : (
            visiveis.map((lote) => (
              <button
                key={lote.id}
                type="button"
                onClick={() => selecionar(lote.id)}
                className={`block w-full text-left px-3 py-3 md:py-2 text-[14px] md:text-[13px] hover:bg-palha-escura ${
                  lote.id === value ? "bg-palha-escura" : ""
                }`}
              >
                {lote.nome}
              </button>
            ))
          )}
          {excedente > 0 && (
            <div className="px-3 py-2 text-[11.5px] text-cinza-claro border-t border-[#F0EBDD]">
              +{excedente} lote{excedente === 1 ? "" : "s"} — refine a busca
            </div>
          )}
        </div>
      )}
    </div>
  );
}
