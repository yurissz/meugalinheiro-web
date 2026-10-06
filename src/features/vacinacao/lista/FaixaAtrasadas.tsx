import type { ReactNode } from "react";
import { iconeAlerta } from "../../../shared/icons";

interface FaixaAtrasadasProps {
  quantidade: number;
  children: ReactNode;
}

export function FaixaAtrasadas({ quantidade, children }: FaixaAtrasadasProps) {
  const plural = quantidade === 1 ? "vacina atrasada" : "vacinas atrasadas";

  return (
    <section className="bg-white border-2 border-terra rounded-app overflow-hidden mb-4">
      <h3 className="flex items-center gap-2 bg-terra text-white px-[14px] py-3">
        <span aria-hidden="true" className="flex-shrink-0">
          {iconeAlerta}
        </span>
        <span className="font-heading text-[16px] md:text-[15px] font-semibold">
          {quantidade} {plural}
        </span>
      </h3>
      <ul>{children}</ul>
    </section>
  );
}
