import { useLocation, useNavigate } from "react-router-dom";

const CHAVE = "cadastroEmOverlay";

/*
 * O estado da rota é serializado pelo navegador e volta sem tipo — este é o único ponto
 * da travessia onde a forma precisa ser reafirmada. Quem abre o overlay define o T.
 */
function lerCadastro<T>(estado: unknown): T | null {
  if (typeof estado !== "object" || estado === null || !(CHAVE in estado)) return null;
  const valor: unknown = estado[CHAVE];
  return valor === undefined || valor === null ? null : (valor as T);
}

interface CadastroEmOverlay<T> {
  cadastro: T | null;
  abrir: (valor: T) => void;
  fechar: () => void;
}

/**
 * Guarda o que está sendo cadastrado no estado da rota, não num useState da tela.
 *
 * É o que faz o botão voltar do celular fechar o overlay em vez de abandonar a tela:
 * abrir empurra uma entrada no histórico (mesma URL, só o estado muda), então voltar
 * desfaz essa entrada e o overlay some sozinho — sem ouvir popstate nem desfazer nada
 * à mão. Como a URL não muda, o React Router reaproveita a mesma tela: filtros, página
 * da listagem e posição de scroll continuam intactos.
 */
export function useCadastroEmOverlay<T>(): CadastroEmOverlay<T> {
  const navegar = useNavigate();
  const local = useLocation();
  const cadastro = lerCadastro<T>(local.state);

  function abrir(valor: T) {
    navegar(`${local.pathname}${local.search}`, { state: { [CHAVE]: valor } });
  }

  function fechar() {
    if (!cadastro) return;
    navegar(-1);
  }

  return { cadastro, abrir, fechar };
}
