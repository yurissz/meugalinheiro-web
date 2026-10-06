import { useEffect, useRef, useState } from "react";
import { lerMensagemDeErro } from "../api/errosFormulario";
import type { PaginaResposta } from "../api/pagina";

export interface ResultadoPaginacao<T> {
  itens: T[];
  pagina: number;
  totalPaginas: number;
  totalElementos: number;
  tamanho: number;
  carregando: boolean;
  /** Mensagem pronta pra exibir, ou null se deu certo. */
  erro: string | null;
  irParaPagina: (pagina: number) => void;
  paginaAnterior: () => void;
  proximaPagina: () => void;
  primeiraPagina: () => void;
  ultimaPagina: () => void;
  recarregar: () => void;
}

/**
 * Busca uma página por vez de um endpoint paginado (formato PaginaResposta) e expõe
 * o estado de navegação (página atual, totais, carregando) e as ações pra andar entre páginas.
 *
 * `dependencias` funciona como o array de deps de um useEffect: ao mudar (ex.: mês selecionado,
 * filtro de lote), volta pra primeira página e busca de novo.
 */
export function usePaginacao<T>(
  buscarPagina: (pagina: number, tamanho: number) => Promise<PaginaResposta<T>>,
  tamanho = 20,
  dependencias: unknown[] = [],
  mensagemDeErro = "Não foi possível carregar a lista. Tente de novo.",
): ResultadoPaginacao<T> {
  const [pagina, setPagina] = useState(0);
  const [resposta, setResposta] = useState<PaginaResposta<T> | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  // Sempre a versão mais recente da função de busca, sem precisar listá-la nas deps do efeito.
  const buscarPaginaRef = useRef(buscarPagina);
  useEffect(() => {
    buscarPaginaRef.current = buscarPagina;
  });

  useEffect(() => {
    function voltarParaPrimeiraPagina() {
      setPagina(0);
    }
    voltarParaPrimeiraPagina();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  useEffect(() => {
    let cancelado = false;
    async function buscar() {
      setCarregando(true);
      setErro(null);
      try {
        const dados = await buscarPaginaRef.current(pagina, tamanho);
        if (!cancelado) setResposta(dados);
      } catch (capturado) {
        if (!cancelado) setErro(lerMensagemDeErro(capturado, mensagemDeErro));
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    buscar();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina, tamanho, versao, ...dependencias]);

  return {
    itens: resposta?.content ?? [],
    pagina,
    totalPaginas: resposta?.totalPages ?? 0,
    totalElementos: resposta?.totalElements ?? 0,
    tamanho,
    carregando,
    erro,
    irParaPagina: (p) => setPagina(Math.max(0, p)),
    paginaAnterior: () => setPagina((p) => Math.max(0, p - 1)),
    proximaPagina: () => setPagina((p) => (resposta && p >= resposta.totalPages - 1 ? p : p + 1)),
    primeiraPagina: () => setPagina(0),
    ultimaPagina: () => setPagina(Math.max(0, (resposta?.totalPages ?? 1) - 1)),
    recarregar: () => setVersao((v) => v + 1),
  };
}
