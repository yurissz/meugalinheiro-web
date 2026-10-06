import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Botao } from "../../shared/components/Botao";
import { Card } from "../../shared/components/Card";
import { CampoTexto } from "../../shared/components/Campo";
import { CampoSenha } from "../../shared/components/CampoSenha";
import { lerErroDeFormulario, SEM_ERRO, type ErroDeFormulario } from "../../shared/api/errosFormulario";
import { iconeLogo, iconeOvo, iconePena, iconeTrigo } from "../../shared/icons";
import { login, registrar } from "./api";
import { apenasDigitos, celularValido, formatarCelular } from "./celular";
import { useAuth } from "./useAuth";

type Modo = "entrar" | "criar";

const SENHA_MINIMA = 6;

const DESTAQUES = [
  { icone: iconeOvo, texto: "Vendas e gastos, separados do dinheiro de casa" },
  { icone: iconePena, texto: "Mortalidade e vacinação, sempre em dia" },
  { icone: iconeTrigo, texto: "Lotes organizados por idade e fase" },
];

export function LoginPage() {
  const { entrar, expirou } = useAuth();
  // Quem chegou por "Criar minha conta" na landing tem que cair no cadastro, não no login:
  // abrir na aba errada obriga a pessoa a perceber sozinha que clicou no botão certo.
  const [parametros] = useSearchParams();
  const [modo, setModo] = useState<Modo>(parametros.get("modo") === "criar" ? "criar" : "entrar");
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<ErroDeFormulario>(SEM_ERRO);

  function trocarModo(novoModo: Modo) {
    setModo(novoModo);
    setErro(SEM_ERRO);
  }

  async function handleSubmit(evento: FormEvent) {
    evento.preventDefault();

    if (!celularValido(celular)) {
      setErro({ mensagem: "", campos: { celular: "Informe o celular com DDD, por exemplo (75) 99999-0000." } });
      return;
    }

    setCarregando(true);
    setErro(SEM_ERRO);
    const celularNormalizado = apenasDigitos(celular);

    try {
      const resposta =
        modo === "entrar"
          ? await login({ celular: celularNormalizado, senha })
          : await registrar({ nome, celular: celularNormalizado, senha });
      entrar(resposta);
    } catch (capturado) {
      setErro(
        lerErroDeFormulario(
          capturado,
          "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.",
        ),
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Painel de marca — no mobile fica uma faixa compacta no topo; no desktop, um
          hero de tela cheia (o form ganha só metade), como uma tela de login "de verdade". */}
      <div className="relative overflow-hidden bg-gradient-to-br from-verde-escuro to-verde text-white px-6 py-7 lg:w-1/2 lg:px-14 lg:py-10 lg:flex lg:flex-col lg:justify-center">
        <svg viewBox="0 0 40 34" aria-hidden="true" className="absolute -right-10 -bottom-10 w-64 h-56 text-white/[0.06] pointer-events-none">
          <path
            d="M4 32 C4 20 6 12 10 12 C13 12 14 17 14 17 C14 8 17 3 21 3 C25 3 26 9 26 9 C27 4 30 6 32 10 C35 16 36 24 36 32 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative">
          <div className="flex items-center gap-[10px] lg:mb-10">
            <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 text-gema">
              {iconeLogo}
            </div>
            <div>
              <div className="font-heading font-semibold text-base leading-tight">Meu Galinheiro</div>
              <div className="text-[11px] text-white/70">gestão simples da criação</div>
            </div>
          </div>

          <h1 className="font-heading text-[19px] lg:text-[30px] font-semibold leading-tight mt-5 lg:mt-10 mb-2 lg:mb-3 max-w-md">
            Do galinheiro pra planilha, sem enrolação.
          </h1>
          <p className="text-white/75 text-[13.5px] lg:text-[14px] mb-0 lg:mb-9 max-w-sm">
            Controle lotes, vacinação e o financeiro da sua criação em poucos toques — pensado pra quem cuida de
            galinha, não de sistema.
          </p>

          <div className="hidden lg:flex flex-col gap-4">
            {DESTAQUES.map((item) => (
              <div key={item.texto} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  {item.icone}
                </span>
                <span className="text-[13.5px] text-white/90">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start lg:items-center justify-center bg-palha px-4 py-6 lg:py-10">
        <Card className="w-full max-w-sm">
          {/* Sessão caída sozinha: a pessoa precisa entender que não é a API que está fora. */}
          {expirou && (
            <div className="bg-gema-bg border border-[#EBD6AE] text-gema-texto rounded-app px-4 py-[13px] text-[13px] mb-4">
              Sua sessão expirou por segurança. Entre de novo para continuar.
            </div>
          )}

          <div className="flex gap-1 bg-palha-escura rounded-[9px] p-1 mb-5">
            <button
              type="button"
              onClick={() => trocarModo("entrar")}
              aria-pressed={modo === "entrar"}
              className={`flex-1 text-[13.5px] py-[11px] rounded-md cursor-pointer transition-colors ${
                modo === "entrar" ? "bg-white text-tinta font-semibold shadow-sm" : "text-cinza font-medium hover:text-tinta"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => trocarModo("criar")}
              aria-pressed={modo === "criar"}
              className={`flex-1 text-[13.5px] py-[11px] rounded-md cursor-pointer transition-colors ${
                modo === "criar" ? "bg-white text-tinta font-semibold shadow-sm" : "text-cinza font-medium hover:text-tinta"
              }`}
            >
              Criar conta
            </button>
          </div>

          {erro.mensagem && (
            <div role="alert" className="bg-terra-bg border border-[#EBC2B3] text-terra rounded-app px-4 py-[13px] text-[13px] mb-4">
              {erro.mensagem}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {modo === "criar" && (
              <CampoTexto
                rotulo="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                erro={erro.campos.nome}
                maxLength={120}
                className="mb-4"
                required
              />
            )}

            <CampoTexto
              rotulo="Celular"
              type="tel"
              inputMode="numeric"
              value={formatarCelular(celular)}
              onChange={(e) => setCelular(apenasDigitos(e.target.value))}
              placeholder="(75) 99999-0000"
              autoComplete="tel"
              erro={erro.campos.celular}
              className="mb-4"
              required
            />

            <CampoSenha
              rotulo="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              autoComplete={modo === "entrar" ? "current-password" : "new-password"}
              erro={erro.campos.senha}
              dica={modo === "criar" ? `Pelo menos ${SENHA_MINIMA} caracteres.` : undefined}
              minLength={modo === "criar" ? SENHA_MINIMA : undefined}
              className="mb-5"
              required
            />

            <Botao type="submit" variante="primary" disabled={carregando} className="w-full">
              {carregando ? "Aguarde..." : modo === "entrar" ? "Entrar" : "Criar conta"}
            </Botao>
          </form>
        </Card>
      </div>
    </div>
  );
}
