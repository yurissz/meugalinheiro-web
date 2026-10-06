import { useState } from "react";

export interface ResultadoPaginacaoLocal<T> {
  itens: T[];
  pagina: number;
  totalPaginas: number;
  totalElementos: number;
  irParaPagina: (pagina: number) => void;
  paginaAnterior: () => void;
  proximaPagina: () => void;
  primeiraPagina: () => void;
  ultimaPagina: () => void;
}

/**
 * Pagina no cliente uma lista que já foi carregada por inteiro (ex.: endpoints sem
 * paginação no backend). Mesma interface de retorno do usePaginacao, pra reusar o
 * componente <Paginacao> sem chamadas extra à API.
 */
export function usePaginacaoLocal<T>(itens: T[], tamanho = 20): ResultadoPaginacaoLocal<T> {
  const [pagina, setPagina] = useState(0);
  const totalPaginas = Math.ceil(itens.length / tamanho);
  const paginaAtual = Math.min(pagina, Math.max(0, totalPaginas - 1));
  const inicio = paginaAtual * tamanho;

  return {
    itens: itens.slice(inicio, inicio + tamanho),
    pagina: paginaAtual,
    totalPaginas,
    totalElementos: itens.length,
    irParaPagina: (p) => setPagina(Math.max(0, p)),
    paginaAnterior: () => setPagina((p) => Math.max(0, p - 1)),
    proximaPagina: () => setPagina((p) => Math.min(totalPaginas - 1, p + 1)),
    primeiraPagina: () => setPagina(0),
    ultimaPagina: () => setPagina(Math.max(0, totalPaginas - 1)),
  };
}
