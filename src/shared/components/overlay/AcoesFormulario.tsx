import { Botao } from "../Botao";
import { useFecharOverlay } from "./contextoOverlay";

interface AcoesFormularioProps {
  salvando: boolean;
  textoConfirmar: string;
}

/**
 * Rodapé fixo dos formulários em overlay. Grudado na base da área de rolagem: no celular
 * o botão de salvar continua alcançável com o polegar mesmo em formulário comprido, sem
 * precisar rolar até o fim pra achar onde confirmar.
 */
export function AcoesFormulario({ salvando, textoConfirmar }: AcoesFormularioProps) {
  const fechar = useFecharOverlay();

  return (
    <div className="sticky bottom-0 -mx-5 mt-5 px-5 py-[14px] bg-white border-t border-borda flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <Botao onClick={fechar} disabled={salvando} className="w-full sm:w-auto">
        Cancelar
      </Botao>
      <Botao type="submit" variante="primary" disabled={salvando} className="w-full sm:w-auto">
        {salvando ? "Salvando..." : textoConfirmar}
      </Botao>
    </div>
  );
}
