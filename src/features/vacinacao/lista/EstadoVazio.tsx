import type { ReactNode } from "react";

interface EstadoVazioProps {
  titulo: string;
  descricao: ReactNode;
  children?: ReactNode;
}

export function EstadoVazio({ titulo, descricao, children }: EstadoVazioProps) {
  return (
    <div className="bg-white border border-borda rounded-app text-center py-[34px] px-5 mb-3">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-heading text-[17px] font-semibold">{titulo}</h3>
        <p className="text-[13.5px] text-cinza max-w-[420px]">{descricao}</p>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </div>
  );
}
