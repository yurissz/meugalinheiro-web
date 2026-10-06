import { createContext } from "react";
import type { NotificacaoContextValue } from "./tipos";

export const NotificacaoContext = createContext<NotificacaoContextValue | null>(null);
