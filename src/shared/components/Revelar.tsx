import type { ReactNode } from "react";
import { useRevelarAoEntrar } from "../hooks/useRevelarAoEntrar";

interface RevelarProps {
  children: ReactNode;
  /** Atraso em ms — pra escalonar itens de uma mesma lista/grade (ex.: cards que aparecem em sequência). */
  atraso?: number;
  /**
   * Nasce visível, sem esperar o observer. Obrigatório pra tudo que está acima da dobra:
   * o conteúdo que a pessoa vê ao abrir a página não pode depender de JS pra existir.
   */
  imediato?: boolean;
  className?: string;
}

/**
 * Fade + leve translação pra cima quando o elemento entra na tela. `motion-reduce:` cobre
 * quem tem a preferência ativada mesmo que o JS já tenha marcado visivel=true na hora —
 * dupla camada de segurança, sem depender só do hook.
 */
export function Revelar({ children, atraso = 0, imediato = false, className = "" }: RevelarProps) {
  const { ref, visivel } = useRevelarAoEntrar<HTMLDivElement>(imediato);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visivel ? `${atraso}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        visivel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
    >
      {children}
    </div>
  );
}
