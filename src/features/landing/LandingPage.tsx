import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Revelar } from "../../shared/components/Revelar";
import {
  iconeAlerta,
  iconeCifrao,
  iconeLogo,
  iconeLotesPilha,
  iconePena,
  iconeSeringa,
} from "../../shared/icons";
import { formatarMoeda } from "../../shared/format";
import { Avatar, CelularResumo, CenaQuintal, CestaDeOvos, Galinha, SacoDeRacao } from "./ilustracoes";

const CRISTA_PATH =
  "M4 32 C4 20 6 12 10 12 C13 12 14 17 14 17 C14 8 17 3 21 3 C25 3 26 9 26 9 C27 4 30 6 32 10 C35 16 36 24 36 32 Z";

/*
 * Destinos de acesso. "Criar minha conta" precisa abrir o formulário JÁ no cadastro —
 * mandar pra aba "Entrar" faz a pessoa que acabou de decidir se cadastrar ter que
 * descobrir sozinha que clicou no botão certo. É o vazamento mais caro de um funil.
 */
const CAMINHO_CRIAR_CONTA = "/app?modo=criar";
const CAMINHO_ENTRAR = "/app";

const classesBotaoClaro =
  "inline-block bg-white text-verde font-medium text-[15px] px-7 py-[15px] rounded-lg hover:bg-palha transition-colors duration-200";

interface Persona {
  variante: "coque" | "bone" | "lenco" | "chapeu";
  titulo: string;
  texto: string;
}

/**
 * Retratos de quem cria — não são depoimentos, são situações. A ideia é a pessoa bater o
 * olho e pensar "esse aqui sou eu" antes mesmo de ler o que o sistema faz.
 */
const PERSONAS: Persona[] = [
  {
    variante: "coque",
    titulo: "Quem começou com 20 e já tem 200",
    texto: "No começo o caderno dava conta. Agora não dá mais — e a memória também não.",
  },
  {
    variante: "bone",
    titulo: "Quem vende na feira todo sábado",
    texto: "Precisa saber se o preço da caixa está pagando a ração, não só se o freguês achou caro.",
  },
  {
    variante: "lenco",
    titulo: "Quem toca a criação junto com a casa",
    texto: "O dinheiro do ovo paga o mercado, e no fim do mês ninguém sabe o que foi da criação.",
  },
  {
    variante: "chapeu",
    titulo: "Quem já perdeu lote por vacina esquecida",
    texto: "Uma vez só basta pra nunca mais querer confiar na memória.",
  },
];

const PROBLEMAS: string[] = [
  "Fecha o mês sem saber se lucrou ou só girou dinheiro de um lado pro outro.",
  "Uma vacina esquecida pode custar um lote inteiro — e isso já aconteceu com muita gente.",
  "O dinheiro da criação se mistura com o de casa, e ninguém sabe mais separar.",
  "Sistema de gestão feito pra fazenda grande, caro e complicado demais pra sua realidade.",
];

interface Momento {
  ilustracao: ReactNode;
  quando: string;
  titulo: string;
  texto: string;
}

const DIA_COMUM: Momento[] = [
  {
    ilustracao: <CestaDeOvos className="w-full h-full" />,
    quando: "De manhã",
    titulo: "Ainda no galinheiro",
    texto: "Coletou, vendeu uma caixa, perdeu uma ave? Registra ali mesmo, pelo celular, antes de tirar a bota.",
  },
  {
    ilustracao: <SacoDeRacao className="w-full h-full" />,
    quando: "Durante a semana",
    titulo: "Na hora que o gasto acontece",
    texto: "Comprou ração, pagou o vacinador, trocou o bebedouro. Anota na hora — a conta do mês se faz sozinha.",
  },
  {
    ilustracao: <CelularResumo className="w-full h-full" />,
    quando: "No fim do mês",
    titulo: "A conta já está pronta",
    texto: "Você abre e vê: entrou tanto, saiu tanto, sobrou isso. Sem somar nada no papel.",
  },
];

interface Area {
  titulo: string;
  texto: string;
  icone: ReactNode;
}

const AREAS: Area[] = [
  {
    titulo: "Financeiro",
    texto: "Separe o que é da criação do que é de casa. Vendas, gastos e o lucro do mês, sempre à mão.",
    icone: iconeCifrao,
  },
  {
    titulo: "Mortalidade",
    texto: "Registre uma perda em segundos e enxergue se algo está fora do normal antes que vire prejuízo maior.",
    icone: iconePena,
  },
  {
    titulo: "Sanidade e vacinação",
    texto: "Um calendário que avisa antes da vacina atrasar — não depois.",
    icone: iconeSeringa,
  },
  {
    titulo: "Gestão de lotes",
    texto: "Cada lote com sua idade, fase e raça, sem misturar um com o outro.",
    icone: iconeLotesPilha,
  },
];

function MarcaDagua({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 34" aria-hidden="true" className={className}>
      <path d={CRISTA_PATH} fill="currentColor" />
    </svg>
  );
}

/*
 * Espaçamento vertical das seções. No celular a página inteira é uma coluna só, e cada
 * seção de 4 cards já é alta por natureza — respiro de desktop ali vira rolagem pura.
 * Medido antes deste ajuste: quase 10 telas de rolagem num aparelho comum.
 */
const SECAO = "px-6 py-14 sm:py-24";
const CABECALHO_SECAO = "text-center mb-9 sm:mb-14";

export function LandingPage() {
  return (
    <div className="bg-palha text-tinta">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-verde-escuro to-verde text-white">
        <MarcaDagua className="absolute -right-16 -top-20 w-[420px] h-[360px] text-white/[0.06] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 text-gema">{iconeLogo}</span>
              <span className="font-heading font-semibold">Meu Galinheiro</span>
            </div>
            <Link
              to={CAMINHO_ENTRAR}
              className="text-[14px] text-white/85 hover:text-white transition-colors duration-200 py-2"
            >
              Entrar
            </Link>
          </div>

          <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 lg:items-center pt-6 pb-14 sm:pt-14 sm:pb-20">
            {/* imediato: isto é a dobra. O título, a promessa e o botão principal não podem
                depender do IntersectionObserver disparar pra existir na tela. */}
            <Revelar imediato>
              <h1 className="font-heading text-[32px] sm:text-[44px] font-semibold leading-[1.15] mb-5 max-w-lg">
                Você entende de galinha. A gente cuida da conta.
              </h1>
              <p className="text-white/85 text-[16px] sm:text-[18px] max-w-md mb-8 leading-relaxed">
                Registre vendas, gastos, mortalidade e vacina em poucos toques — e saiba se valeu a pena, sem abrir
                uma planilha.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to={CAMINHO_CRIAR_CONTA} className={classesBotaoClaro}>
                  Criar minha conta
                </Link>
                <Link
                  to={CAMINHO_ENTRAR}
                  className="text-[14px] text-white/80 hover:text-white transition-colors duration-200 py-2"
                >
                  já tenho conta
                </Link>
              </div>
              <p className="text-[13px] text-white/70 mt-5">
                Leva menos de 5 minutos. Dá pra começar hoje, com o lote que você já tem.
              </p>
            </Revelar>

            <Revelar imediato atraso={150}>
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[420px]">
                <div className="relative z-10 mx-auto max-w-[300px] sm:max-w-[320px]">
                  <div className="bg-white rounded-app shadow-xl px-5 py-[18px] mb-4 -rotate-2">
                    <div className="text-xs text-cinza mb-[6px]">Lucro do período</div>
                    <div className="font-heading text-2xl font-semibold text-verde">{formatarMoeda(3240)}</div>
                    <div className="text-[12px] text-cinza-claro mt-1">receitas − despesas do período</div>
                  </div>
                  <div className="bg-white rounded-app shadow-xl px-5 py-[18px] ml-auto mr-0 w-[92%] rotate-1">
                    <div className="text-xs text-cinza mb-[6px]">Mortalidade do período</div>
                    <div className="font-heading text-2xl font-semibold text-tinta">4 aves</div>
                    <div className="text-[12px] text-cinza-claro mt-1">total de aves perdidas no período</div>
                  </div>
                </div>
                {/* A cena entra por baixo dos cards: os números flutuam sobre o quintal de verdade */}
                <CenaQuintal className="w-full -mt-10 sm:-mt-12" />
              </div>
            </Revelar>
          </div>
        </div>
      </section>

      {/* Quem é você */}
      <section className={SECAO}>
        <div className="max-w-5xl mx-auto">
          <Revelar className={CABECALHO_SECAO}>
            <h2 className="font-heading text-[26px] sm:text-[32px] font-semibold mb-3">Feito pra gente como você</h2>
            <p className="text-cinza max-w-lg mx-auto">
              Não é sistema de fazenda grande. É pra quem cuida de tudo praticamente sozinho.
            </p>
          </Revelar>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {PERSONAS.map((persona, indice) => (
              <Revelar key={persona.titulo} atraso={indice * 90}>
                <div className="bg-white border border-borda rounded-app p-5 sm:p-6 h-full flex items-start gap-4 transition-transform duration-200 hover:-translate-y-1">
                  <Avatar variante={persona.variante} className="w-[52px] h-[52px] sm:w-[62px] sm:h-[62px] flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-heading font-semibold text-[15px] mb-[6px] leading-snug">{persona.titulo}</div>
                    <p className="text-[13.5px] text-cinza leading-relaxed">{persona.texto}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* O problema */}
      <section className={`relative overflow-hidden bg-white border-y border-borda ${SECAO}`}>
        {/* Galinha espiando a seção, pra quebrar o peso do assunto */}
        <Galinha
          variante="ruiva"
          espelhada
          className="hidden lg:block absolute bottom-0 right-6 w-40 h-40 pointer-events-none"
        />

        <div className="relative max-w-4xl mx-auto">
          <Revelar className={CABECALHO_SECAO}>
            <h2 className="font-heading text-[26px] sm:text-[32px] font-semibold mb-3">O que pesa no dia a dia</h2>
            <p className="text-cinza max-w-lg mx-auto">
              Não é falta de esforço. É difícil enxergar tudo isso só no caderno.
            </p>
          </Revelar>

          {/* No celular vira lista (ícone ao lado do texto); a partir do tablet volta a ser
              grade de cards. Quatro cards empilhados custavam meia tela de rolagem cada. */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
            {PROBLEMAS.map((problema, indice) => (
              <Revelar key={problema} atraso={indice * 90}>
                <div className="bg-palha border border-borda rounded-app p-4 sm:p-6 h-full flex items-start gap-4 sm:block">
                  <div className="w-10 h-10 rounded-full bg-terra-bg text-terra flex items-center justify-center flex-shrink-0 sm:mb-4">
                    {iconeAlerta}
                  </div>
                  <p className="text-[14.5px] sm:text-[15px] leading-relaxed">{problema}</p>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Um dia comum */}
      <section className={`bg-verde-claro ${SECAO}`}>
        <div className="max-w-5xl mx-auto">
          <Revelar className={CABECALHO_SECAO}>
            <h2 className="font-heading text-[26px] sm:text-[32px] font-semibold mb-3">
              Um dia comum com o Meu Galinheiro
            </h2>
            <p className="text-cinza max-w-lg mx-auto">
              Nada de parar o que você está fazendo pra "alimentar o sistema".
            </p>
          </Revelar>

          <div className="grid sm:grid-cols-3 gap-3 sm:gap-5">
            {DIA_COMUM.map((momento, indice) => (
              <Revelar key={momento.titulo} atraso={indice * 110}>
                <div className="bg-white rounded-app p-4 sm:p-6 h-full flex items-start gap-4 sm:block sm:text-center">
                  <div className="w-14 h-14 sm:w-[86px] sm:h-[86px] flex-shrink-0 sm:mx-auto sm:mb-4 bg-palha rounded-full p-2 sm:p-3">
                    {momento.ilustracao}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] uppercase tracking-wide text-gema-texto font-medium mb-1">
                      {momento.quando}
                    </div>
                    <div className="font-heading font-semibold text-[15px] mb-2">{momento.titulo}</div>
                    <p className="text-[13.5px] text-cinza leading-relaxed">{momento.texto}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className={SECAO}>
        <div className="max-w-6xl mx-auto">
          <Revelar className={CABECALHO_SECAO}>
            <h2 className="font-heading text-[26px] sm:text-[32px] font-semibold mb-3">Tudo num lugar só</h2>
            <p className="text-cinza max-w-lg mx-auto">
              Quatro áreas — pensadas pra quem cuida da criação, não de sistema.
            </p>
          </Revelar>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {AREAS.map((area, indice) => (
              <Revelar key={area.titulo} atraso={indice * 90}>
                <div className="bg-white border border-borda rounded-app p-4 sm:p-6 h-full flex items-start gap-4 sm:block transition-transform duration-200 hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-full bg-gema-bg text-gema flex items-center justify-center flex-shrink-0 sm:mb-4">
                    <span className="w-5 h-5 flex items-center justify-center">{area.icone}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-semibold text-[15px] mb-[6px]">{area.titulo}</div>
                    <p className="text-[13.5px] text-cinza leading-relaxed">{area.texto}</p>
                  </div>
                </div>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social */}
      <section className={`bg-gema-bg ${SECAO}`}>
        {/*
         * Depoimento fictício — placeholder até termos depoimentos reais de clientes.
         * Ao trocar, use nome, cidade e (de preferência) foto de gente de verdade: o avatar
         * ilustrado está aqui só pra seção não ficar sem rosto enquanto isso.
         */}
        <Revelar className="max-w-2xl mx-auto">
          <div className="bg-white border border-borda rounded-app shadow-sm px-6 py-8 sm:px-12 sm:py-10 text-center">
            <Avatar variante="chapeu" className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 sm:mb-6" />
            <p className="font-heading text-[18px] sm:text-[23px] leading-snug mb-5 sm:mb-6">
              "Antes eu só sabia se tinha sobrado dinheiro olhando a conta no fim do mês. Agora eu sei antes — e evitei
              perder um lote inteiro porque o aplicativo me lembrou da vacina três dias antes."
            </p>
            <div className="text-[13.5px] text-cinza">
              <strong className="text-tinta">João Batista</strong> · criador de poedeiras, Feira de Santana (BA)
            </div>
          </div>
        </Revelar>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden bg-gradient-to-br from-verde-escuro to-verde text-white text-center px-6 pt-14 pb-28 sm:pt-24 sm:pb-40">
        <MarcaDagua className="absolute -left-16 -bottom-16 w-72 h-64 text-white/[0.06] pointer-events-none" />
        <Revelar className="relative max-w-lg mx-auto">
          <h2 className="font-heading text-[26px] sm:text-[32px] font-semibold mb-3">
            Sua criação já dá trabalho. A conta não precisa dar.
          </h2>
          <p className="text-white/85 mb-8">Leva menos de 5 minutos pra começar a registrar o dia a dia da sua criação.</p>
          <Link to={CAMINHO_CRIAR_CONTA} className={classesBotaoClaro}>
            Criar minha conta
          </Link>
        </Revelar>

        {/* Fileira de galinhas no rodapé da seção — a despedida da página */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1 pointer-events-none">
          <Galinha variante="branca" className="w-20 h-20 sm:w-24 sm:h-24" />
          <Galinha variante="dourada" espelhada className="w-16 h-16 sm:w-20 sm:h-20" />
          <Galinha variante="ruiva" className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px]" />
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-verde-escuro text-white/70 text-center text-[13px] px-6 py-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-6 h-6 text-gema">{iconeLogo}</span>
          <span className="font-heading font-semibold text-white/90">Meu Galinheiro</span>
        </div>
        <div>gestão simples da criação — pra quem levanta cedo e cuida do bicho</div>
        <div className="mt-3">© {new Date().getFullYear()} Meu Galinheiro</div>
      </footer>
    </div>
  );
}
