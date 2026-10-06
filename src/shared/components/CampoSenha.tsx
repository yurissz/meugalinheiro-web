import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { classesControle, classesRotulo } from "./campoClasses";
import { iconeOlho, iconeOlhoFechado } from "../icons";

interface CampoSenhaProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id" | "type"> {
  rotulo: string;
  erro?: string;
  dica?: ReactNode;
  className?: string;
}

export function CampoSenha({ rotulo, erro, dica, className = "", ...props }: CampoSenhaProps) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;
  const [visivel, setVisivel] = useState(false);

  return (
    <div className={className}>
      <label htmlFor={id} className={classesRotulo}>
        {rotulo}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visivel ? "text" : "password"}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : dica ? idDica : undefined}
          className={`${classesControle(Boolean(erro))} pr-12`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel((atual) => !atual)}
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visivel}
          className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-md text-cinza-claro hover:text-cinza hover:bg-palha-escura cursor-pointer transition-colors"
        >
          {visivel ? iconeOlhoFechado : iconeOlho}
        </button>
      </div>
      {erro ? (
        <p id={idErro} className="text-[12px] text-terra mt-1">
          {erro}
        </p>
      ) : dica ? (
        <p id={idDica} className="text-[12px] text-cinza mt-1">
          {dica}
        </p>
      ) : null}
    </div>
  );
}
