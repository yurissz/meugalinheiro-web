import type { HTMLAttributes } from "react";

/**
 * Bloco cinza pulsante que ocupa o lugar do conteúdo enquanto a API não responde.
 * `motion-safe:` deixa a pulsação de fora pra quem ativou "reduzir movimento" no
 * sistema — o bloco continua lá, só não pisca.
 */
export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`motion-safe:animate-pulse bg-palha-escura rounded ${className}`} {...props} />;
}
