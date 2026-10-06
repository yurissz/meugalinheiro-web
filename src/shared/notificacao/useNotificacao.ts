import { useContext } from "react";
import { NotificacaoContext } from "./notificacaoContext";
import type { NotificacaoContextValue } from "./tipos";

export function useNotificacao(): NotificacaoContextValue {
  const contexto = useContext(NotificacaoContext);
  if (!contexto) throw new Error("useNotificacao precisa ser usado dentro de <NotificacaoProvider>");
  return contexto;
}
