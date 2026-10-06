import type { ComponentProps } from "react";
import { iconeEditar, iconeExcluir } from "../icons";

interface BotaoIconeProps extends ComponentProps<"button"> {
  rotulo: string;
}

/**
 * Botão de ação compacto (ícone + tooltip) pra caber em linhas de tabela sem forçar
 * scroll lateral. 40px no celular (alvo de toque), 30px a partir do tablet, onde o
 * ponteiro é mouse e a tabela precisa da densidade.
 */
export function BotaoIcone({ rotulo, className = "", type = "button", ...props }: BotaoIconeProps) {
  return (
    <button
      type={type}
      aria-label={rotulo}
      title={rotulo}
      className={`inline-flex items-center justify-center w-10 h-10 md:w-[30px] md:h-[30px] flex-shrink-0 rounded-md border border-borda text-cinza hover:text-tinta hover:border-cinza-claro hover:bg-palha-escura transition-colors cursor-pointer ${className}`}
      {...props}
    />
  );
}

interface AcoesTabelaProps {
  aoEditar?: () => void;
  /** Opcional: linhas que já estão no estado final (lote encerrado) não mostram a ação. */
  aoExcluir?: () => void;
  rotuloEditar?: string;
  rotuloExcluir?: string;
}

/** Par padrão Editar/Excluir usado nas tabelas — compacto o bastante pra nunca precisar de scroll lateral. */
export function AcoesTabela({ aoEditar, aoExcluir, rotuloEditar = "Editar", rotuloExcluir = "Excluir" }: AcoesTabelaProps) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      {aoEditar && (
        <BotaoIcone rotulo={rotuloEditar} onClick={aoEditar}>
          {iconeEditar}
        </BotaoIcone>
      )}
      {aoExcluir && (
        <BotaoIcone rotulo={rotuloExcluir} onClick={aoExcluir}>
          {iconeExcluir}
        </BotaoIcone>
      )}
    </div>
  );
}
