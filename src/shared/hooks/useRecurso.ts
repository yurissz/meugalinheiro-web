import { useEffect, useRef, useState } from "react";
import { lerMensagemDeErro } from "../api/errosFormulario";

export interface ResultadoRecurso<T> {
  dados: T;
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
}

/**
 * Busca um dado da API e devolve o trio carregando/erro/recarregar já resolvido — o
 * mesmo bloco de `useState` + `useEffect` + `try/catch` que estava copiado em cinco telas.
 *
 * `dependencias` funciona como o array de deps de um useEffect: ao mudar (mês, filtro),
 * busca de novo. A função de busca não precisa ser estável entre renders.
 */
export function useRecurso<T>(
  buscar: () => Promise<T>,
  valorInicial: T,
  dependencias: unknown[] = [],
  mensagemDeErro = "Não foi possível carregar os dados. Tente de novo.",
): ResultadoRecurso<T> {
  const [dados, setDados] = useState<T>(valorInicial);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [versao, setVersao] = useState(0);

  // Sempre a versão mais recente da função, sem precisar listá-la nas deps do efeito.
  const buscarRef = useRef(buscar);
  useEffect(() => {
    buscarRef.current = buscar;
  });

  useEffect(() => {
    let cancelado = false;
    async function executar() {
      setCarregando(true);
      setErro(null);
      try {
        const resultado = await buscarRef.current();
        if (!cancelado) setDados(resultado);
      } catch (capturado) {
        if (!cancelado) setErro(lerMensagemDeErro(capturado, mensagemDeErro));
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    executar();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versao, ...dependencias]);

  return { dados, carregando, erro, recarregar: () => setVersao((v) => v + 1) };
}
