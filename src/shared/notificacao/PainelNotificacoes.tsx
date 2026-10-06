import { iconeAlerta, iconeCheck, iconeDesfazer, iconeX } from "../icons";
import type { AcaoNotificacao, Notificacao, TomNotificacao } from "./tipos";

interface PainelNotificacoesProps {
  notificacoes: Notificacao[];
  aoFechar: (id: number) => void;
  aoAcionar: (id: number, acao: AcaoNotificacao) => void;
}

const classesPorTom: Record<TomNotificacao, string> = {
  sucesso: "bg-verde text-white border-verde-escuro",
  erro: "bg-terra text-white border-[#8f3a22]",
};

const iconePorTom: Record<TomNotificacao, typeof iconeCheck> = {
  sucesso: iconeCheck,
  erro: iconeAlerta,
};

export function PainelNotificacoes({ notificacoes, aoFechar, aoAcionar }: PainelNotificacoesProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="fixed z-[60] inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[360px] flex flex-col gap-2 pointer-events-none"
    >
      {notificacoes.map((notificacao) => {
        const acao = notificacao.acao;

        return (
          <div
            key={notificacao.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-app border px-4 py-3 shadow-lg motion-safe:animate-[surgir_180ms_ease-out] ${classesPorTom[notificacao.tom]}`}
          >
            <span className="flex-shrink-0" aria-hidden="true">
              {iconePorTom[notificacao.tom]}
            </span>
            <p className="flex-1 min-w-0 text-[13.5px] leading-snug">{notificacao.mensagem}</p>

            {acao && (
              <button
                type="button"
                onClick={() => aoAcionar(notificacao.id, acao)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-md border border-white/45 bg-white/10 text-[13px] font-semibold text-white hover:bg-white/25 cursor-pointer transition-colors"
              >
                <span aria-hidden="true">{iconeDesfazer}</span>
                {acao.rotulo}
              </button>
            )}

            <button
              type="button"
              onClick={() => aoFechar(notificacao.id)}
              aria-label="Fechar aviso"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md text-white/80 hover:text-white hover:bg-white/15 cursor-pointer transition-colors"
            >
              {iconeX}
            </button>
          </div>
        );
      })}
    </div>
  );
}
