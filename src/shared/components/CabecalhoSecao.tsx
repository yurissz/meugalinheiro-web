import type { ReactNode } from "react";

interface CabecalhoSecaoProps {
  titulo: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function CabecalhoSecao({ titulo, children, className = "" }: CabecalhoSecaoProps) {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-3 ${className}`}>
      <h2 className="text-[15px] font-semibold min-w-0">{titulo}</h2>
      {children && <div className="flex flex-wrap items-center gap-2 min-w-0">{children}</div>}
    </div>
  );
}
