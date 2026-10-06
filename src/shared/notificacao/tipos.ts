export type TomNotificacao = "sucesso" | "erro";

export interface AcaoNotificacao {
  rotulo: string;
  aoAcionar: () => void;
}

export interface Notificacao {
  id: number;
  tom: TomNotificacao;
  mensagem: string;
  acao?: AcaoNotificacao;
}

export interface NotificacaoContextValue {
  notificarSucesso: (mensagem: string, acao?: AcaoNotificacao) => void;
  notificarErro: (mensagem: string) => void;
}
