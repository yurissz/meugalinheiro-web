import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  erro: Error | null;
  tentativa: number;
}

/**
 * Última linha de defesa: se um registro malformado (data nula, campo inesperado etc.)
 * escapar das checagens de cada tela e quebrar o render, isso não pode derrubar o app
 * inteiro numa tela branca — só a área afetada mostra um aviso, com opção de tentar de novo.
 *
 * O `tentativa` entra como key da subárvore: sem ele, limpar o erro remonta o mesmo
 * componente com o mesmo estado e ele quebra de novo no mesmo render.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { erro: null, tentativa: 0 };

  static getDerivedStateFromError(erro: Error): Partial<ErrorBoundaryState> {
    return { erro };
  }

  tentarDeNovo = () => {
    this.setState((atual) => ({ erro: null, tentativa: atual.tentativa + 1 }));
  };

  render() {
    if (this.state.erro) {
      return (
        <div
          role="alert"
          className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px]"
        >
          Não foi possível mostrar esta parte da tela porque um registro veio com dados inesperados.
          <br />
          <button type="button" onClick={this.tentarDeNovo} className="underline cursor-pointer mt-1">
            Tentar de novo
          </button>
        </div>
      );
    }
    return <div key={this.state.tentativa}>{this.props.children}</div>;
  }
}
