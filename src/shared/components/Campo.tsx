import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { classesControle, classesRotulo } from "./campoClasses";

/*
 * Campo de formulário padrão do app. Existe pra garantir três coisas que estavam faltando
 * e eram fáceis de esquecer copiando classes de tela em tela:
 *
 *  1. <label for> ligado ao input por id — leitor de tela anuncia, e tocar no rótulo
 *     foca o campo (alvo de toque de graça no celular);
 *  2. fonte de 16px no mobile — abaixo disso o Safari do iPhone dá zoom ao focar e
 *     joga o formulário pra fora da tela;
 *  3. erro de campo exibido embaixo do próprio campo, com aria-describedby.
 */

interface CampoBaseProps {
  rotulo: string;
  erro?: string;
  dica?: ReactNode;
  className?: string;
}

type CampoTextoProps = CampoBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id">;

export function CampoTexto({ rotulo, erro, dica, className = "", ...props }: CampoTextoProps) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;

  return (
    <div className={className}>
      <label htmlFor={id} className={classesRotulo}>
        {rotulo}
      </label>
      <input
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : dica ? idDica : undefined}
        className={classesControle(Boolean(erro))}
        {...props}
      />
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

type CampoSelecaoProps = CampoBaseProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "id">;

export function CampoSelecao({ rotulo, erro, dica, className = "", children, ...props }: CampoSelecaoProps) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;

  return (
    <div className={className}>
      <label htmlFor={id} className={classesRotulo}>
        {rotulo}
      </label>
      <select
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idErro : dica ? idDica : undefined}
        className={`${classesControle(Boolean(erro))} bg-white cursor-pointer`}
        {...props}
      >
        {children}
      </select>
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

/**
 * Envoltório pra controles que não são <input>/<select> (ex.: o SeletorLote com busca).
 * Quem usa passa o mesmo id pro controle e pro `htmlFor`, então o rótulo continua ligado.
 */
export function CampoCustomizado({
  rotulo,
  erro,
  htmlFor,
  className = "",
  children,
}: CampoBaseProps & { htmlFor?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={classesRotulo}>
        {rotulo}
      </label>
      {children}
      {erro && <p className="text-[12px] text-terra mt-1">{erro}</p>}
    </div>
  );
}
