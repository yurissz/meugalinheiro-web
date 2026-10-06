import { useEffect, useState } from "react";

/**
 * Atrasa a propagação de um valor que muda rápido (ex.: texto digitado) até que ele
 * fique parado por `atrasoMs`. Pensado pra alimentar campos de busca que disparam
 * requisição à API — sem isso, cada tecla digitada vira uma chamada nova.
 */
export function useDebounce<T>(valor: T, atrasoMs = 400): T {
  const [valorComAtraso, setValorComAtraso] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorComAtraso(valor), atrasoMs);
    return () => clearTimeout(temporizador);
  }, [valor, atrasoMs]);

  return valorComAtraso;
}
