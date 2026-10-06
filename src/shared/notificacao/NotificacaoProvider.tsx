import { useEffect, useRef, useState, type ReactNode } from "react";
import { NotificacaoContext } from "./notificacaoContext";
import { PainelNotificacoes } from "./PainelNotificacoes";
import type { AcaoNotificacao, Notificacao, TomNotificacao } from "./tipos";

const DURACAO_MS = 4500;

/* Aviso com ação precisa sobreviver ao tempo de achar e tocar o botão com uma mão só. */
const DURACAO_COM_ACAO_MS = 9000;

export function NotificacaoProvider({ children }: { children: ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const proximoId = useRef(0);
  const temporizadores = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pendentes = temporizadores.current;
    return () => {
      pendentes.forEach(clearTimeout);
      pendentes.clear();
    };
  }, []);

  function fechar(id: number) {
    const temporizador = temporizadores.current.get(id);
    if (temporizador) {
      clearTimeout(temporizador);
      temporizadores.current.delete(id);
    }
    setNotificacoes((atuais) => atuais.filter((notificacao) => notificacao.id !== id));
  }

  function notificar(tom: TomNotificacao, mensagem: string, acao?: AcaoNotificacao) {
    const id = proximoId.current++;
    setNotificacoes((atuais) => [...atuais, { id, tom, mensagem, acao }]);
    temporizadores.current.set(
      id,
      setTimeout(() => fechar(id), acao ? DURACAO_COM_ACAO_MS : DURACAO_MS),
    );
  }

  function acionar(id: number, acao: AcaoNotificacao) {
    fechar(id);
    acao.aoAcionar();
  }

  const valor = {
    notificarSucesso: (mensagem: string, acao?: AcaoNotificacao) => notificar("sucesso", mensagem, acao),
    notificarErro: (mensagem: string) => notificar("erro", mensagem),
  };

  return (
    <NotificacaoContext.Provider value={valor}>
      {children}
      <PainelNotificacoes notificacoes={notificacoes} aoFechar={fechar} aoAcionar={acionar} />
    </NotificacaoContext.Provider>
  );
}
