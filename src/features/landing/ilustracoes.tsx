import { useId } from "react";

/*
 * Ilustrações da landing — desenhadas à mão em SVG, na paleta da marca (palha, verde,
 * gema, terra). Escolha consciente em vez de banco de imagem: nada pra baixar, escala em
 * qualquer tela, e o traço fica igual em todas as seções.
 *
 * Cada figura existe em duas formas:
 *   - <NomeFigura>  → um <g> em coordenadas locais, pra compor dentro de uma cena maior;
 *   - <Nome>        → um <svg> fechado, pronto pra usar solto no meio do texto.
 *
 * Tudo aqui é decorativo (aria-hidden): a informação está sempre no texto ao lado.
 */

const TINTA = "#26241f";
const GEMA = "#e8a13d";
const TERRA = "#b0492b";

type PenaVariante = "branca" | "ruiva" | "dourada";

const PENAS: Record<PenaVariante, { corpo: string; asa: string; rabo: string }> = {
  branca: { corpo: "#ffffff", asa: "#efe7d2", rabo: "#ded2b4" },
  ruiva: { corpo: "#d98b5c", asa: "#b0492b", rabo: "#8f3a22" },
  dourada: { corpo: "#f0c27a", asa: "#dc9a3c", rabo: "#b87d2b" },
};

interface GalinhaProps {
  variante?: PenaVariante;
  /** Vira a galinha pro outro lado — pra uma fileira não ficar toda olhando pro mesmo canto. */
  espelhada?: boolean;
}

/** Galinha em coordenadas locais 0–100, com os pés apoiados em y ≈ 99. */
export function GalinhaFigura({ variante = "branca", espelhada = false }: GalinhaProps) {
  const pena = PENAS[variante];

  return (
    <g transform={espelhada ? "translate(100,0) scale(-1,1)" : undefined}>
      <g stroke={TINTA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        {/* rabo — duas penas em leque, atrás do corpo */}
        <path d="M26 64 C12 58 4 42 8 26 C20 32 30 46 34 58 Z" fill={pena.rabo} />
        <path d="M28 68 C18 60 16 46 20 34 C29 42 35 54 36 64 Z" fill={pena.asa} />

        {/* pernas — desenhadas antes do corpo pra sumirem por baixo dele */}
        <g stroke={GEMA} strokeWidth="2.8" fill="none">
          <path d="M44 78 V93 M44 93 L37 98 M44 93 V99 M44 93 L51 98" />
          <path d="M58 78 V93 M58 93 L51 98 M58 93 V99 M58 93 L65 98" />
        </g>

        <ellipse cx="50" cy="62" rx="28" ry="23" fill={pena.corpo} />

        {/* asa */}
        <path d="M38 58 C48 48 64 50 68 61 C58 72 42 71 38 58 Z" fill={pena.asa} />
        <path d="M48 67 C54 65 61 61 65 56" fill="none" strokeWidth="1.6" />

        {/* crista — três gomos que a cabeça cobre pela metade */}
        <g fill={TERRA}>
          <circle cx="64" cy="21" r="5.5" />
          <circle cx="71" cy="17" r="6" />
          <circle cx="78" cy="22" r="5" />
        </g>

        <circle cx="71" cy="37" r="16" fill={pena.corpo} />
        <path d="M86 34 L98 40 L86 45 Z" fill={GEMA} />
        <ellipse cx="82" cy="51" rx="3.4" ry="6" fill={TERRA} />

        <circle cx="76" cy="34" r="2.8" fill={TINTA} stroke="none" />
        <circle cx="77.2" cy="32.8" r="1" fill="#ffffff" stroke="none" />
      </g>
    </g>
  );
}

export function Galinha({ className = "", ...props }: GalinhaProps & { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <GalinhaFigura {...props} />
    </svg>
  );
}

/** Pintinho em coordenadas locais 0–60, pés em y ≈ 58. */
export function PintinhoFigura() {
  return (
    <g stroke={TINTA} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
      <g stroke={GEMA} strokeWidth="2.4" fill="none">
        <path d="M24 46 V54 M24 54 L19 58 M24 54 L29 58" />
        <path d="M34 46 V54 M34 54 L29 58 M34 54 L39 58" />
      </g>
      <ellipse cx="29" cy="38" rx="17" ry="15" fill="#f6cd7d" />
      <path d="M22 36 C28 31 38 33 40 40 C33 46 24 44 22 36 Z" fill="#edb95a" />
      <circle cx="34" cy="22" r="13" fill="#f6cd7d" />
      <path d="M46 20 L55 24 L46 28 Z" fill={GEMA} />
      <path d="M30 10 C30 4 35 2 37 6" fill="none" />
      <circle cx="38" cy="19" r="2.4" fill={TINTA} stroke="none" />
      <circle cx="39" cy="18" r="0.9" fill="#ffffff" stroke="none" />
    </g>
  );
}

/** Criador de chapéu de palha com o celular na mão — local 0–110 de largura, pés em y ≈ 149. */
export function CriadorFigura() {
  return (
    <g stroke={TINTA} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
      {/* pernas e botas */}
      <path d="M38 86 h16 l-2 54 h-14 Z" fill="#41505e" />
      <path d="M58 86 h16 l2 54 h-14 Z" fill="#41505e" />
      <path d="M33 138 h21 v7 a4 4 0 0 1 -4 4 H33 a4 4 0 0 1 -4 -4 Z" fill="#6b4a2f" />
      <path d="M60 138 h21 a4 4 0 0 1 4 4 v3 a4 4 0 0 1 -4 4 H60 Z" fill="#6b4a2f" />

      {/* braços (atrás do tronco) */}
      <path d="M33 56 C24 64 22 80 27 93 L39 89 C35 79 36 67 43 59 Z" fill="#17513d" />
      <path d="M79 56 C89 62 91 75 85 84 L74 78 C79 71 77 64 70 60 Z" fill="#17513d" />

      {/* tronco */}
      <path d="M34 56 C34 45 42 39 56 39 C70 39 78 45 78 56 L80 92 C64 98 48 98 32 92 Z" fill="#1e5c46" />

      {/* mão + celular */}
      <g transform="rotate(-14 80 78)">
        <rect x="71" y="58" width="17" height="27" rx="3.5" fill="#ffffff" />
        <rect x="74.5" y="62" width="10" height="19" rx="1.5" fill="#e3f0ea" stroke="none" />
        <path d="M77 74 h5 M77 69 h5" stroke="#1e5c46" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <circle cx="80" cy="86" r="6" fill="#d9a074" />
      <circle cx="30" cy="93" r="6" fill="#d9a074" />

      {/* cabeça */}
      <circle cx="56" cy="26" r="15" fill="#d9a074" />
      <g fill={TINTA} stroke="none">
        <circle cx="51" cy="25" r="1.9" />
        <circle cx="62" cy="25" r="1.9" />
      </g>
      <path d="M51 31 q5 5 10 0" fill="none" strokeWidth="2.2" />

      {/* chapéu de palha */}
      <path d="M42 16 C42 4 48 0 56 0 C64 0 70 4 70 16 Z" fill="#eedbb0" />
      <ellipse cx="56" cy="17" rx="27" ry="7" fill="#e3c88f" />
      <path d="M43 14 C48 18 64 18 69 14" stroke={TERRA} strokeWidth="4" fill="none" />
    </g>
  );
}

/**
 * O quintal: sol, cerca, galinheiro e a criação solta — com o criador conferindo tudo pelo
 * celular. Fundo transparente de propósito: a cena se apoia no verde da seção do hero.
 */
export function CenaQuintal({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 250" className={className} aria-hidden="true">
      {/* sol da manhã — baixo o bastante pra não sumir atrás dos cards que flutuam em cima */}
      <circle cx="370" cy="78" r="30" fill={GEMA} opacity="0.16" />
      <circle cx="370" cy="78" r="20" fill="#f2b95c" />

      {/* névoa da manhã atrás do galinheiro */}
      <g fill="#f5eedc" opacity="0.07">
        <ellipse cx="96" cy="72" rx="46" ry="16" />
        <ellipse cx="130" cy="66" rx="30" ry="13" />
      </g>

      {/* cerca — encurtada nas pontas pra não encostar na borda do desenho */}
      <g stroke="#f5eedc" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45">
        <path d="M30 168 H392 M30 186 H392" />
        {[38, 96, 154, 212, 270, 328, 386].map((x) => (
          <path key={x} d={`M${x} 152 V200`} />
        ))}
      </g>

      {/* galinheiro */}
      <g stroke={TINTA} strokeWidth="2.6" strokeLinejoin="round">
        <rect x="36" y="120" width="104" height="78" rx="6" fill="#f5eedc" />
        <path d="M24 123 L88 76 L152 123 Z" fill={TERRA} />
        <path d="M74 198 V162 a14 14 0 0 1 28 0 V198 Z" fill="#123b2d" />
        <rect x="110" y="139" width="22" height="21" rx="4" fill={GEMA} />
        <rect x="46" y="139" width="20" height="21" rx="4" fill={GEMA} />
      </g>

      {/* terreiro — uma ilha oval em duas camadas: nenhuma borda reta encostando no recorte */}
      <ellipse cx="210" cy="210" rx="198" ry="34" fill="#2c7052" />
      <ellipse cx="210" cy="220" rx="188" ry="26" fill="#3f8f69" />

      {/* a criação */}
      <g transform="translate(38,149) scale(0.66)">
        <GalinhaFigura variante="branca" />
      </g>
      <g transform="translate(148,148) scale(0.85)">
        <GalinhaFigura variante="ruiva" />
      </g>
      <g transform="translate(262,155) scale(0.55)">
        <GalinhaFigura variante="dourada" espelhada />
      </g>
      <g transform="translate(232,207) scale(0.5)">
        <PintinhoFigura />
      </g>

      <g transform="translate(316,105) scale(0.78)">
        <CriadorFigura />
      </g>
    </svg>
  );
}

type AvatarVariante = "coque" | "bone" | "lenco" | "chapeu";

const ROSTOS: Record<AvatarVariante, { pele: string; cabelo: string; camisa: string; fundo: string }> = {
  coque: { pele: "#c98a5f", cabelo: "#2f271f", camisa: "#1e5c46", fundo: "#e3f0ea" },
  bone: { pele: "#8a5a3b", cabelo: "#221d18", camisa: "#b0492b", fundo: "#fbf0dc" },
  lenco: { pele: "#e3b18a", cabelo: "#3b2c22", camisa: "#123b2d", fundo: "#f9e9e3" },
  chapeu: { pele: "#d9a074", cabelo: "#b9b2a5", camisa: "#1e5c46", fundo: "#eae0c8" },
};

/**
 * Bustos ilustrados pras seções de gente — variam no tom de pele, no cabelo e no que
 * levam na cabeça (coque, boné, lenço, chapéu de palha) pra representar quem cria de
 * verdade, não um avatar genérico de banco de imagem.
 */
export function Avatar({ variante, className = "" }: { variante: AvatarVariante; className?: string }) {
  const idUnico = useId();
  const recorte = `recorte-avatar-${idUnico}`;
  const { pele, cabelo, camisa, fundo } = ROSTOS[variante];

  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <clipPath id={recorte}>
          <circle cx="40" cy="40" r="40" />
        </clipPath>
      </defs>
      <circle cx="40" cy="40" r="40" fill={fundo} />

      <g clipPath={`url(#${recorte})`} stroke={TINTA} strokeWidth="2.2" strokeLinejoin="round">
        <path d="M33 40 h14 v15 h-14 Z" fill={pele} />
        <path d="M2 84 C2 63 19 53 40 53 C61 53 78 63 78 84 Z" fill={camisa} />
        <circle cx="40" cy="31" r="17" fill={pele} />

        {variante === "coque" && (
          <>
            <circle cx="40" cy="11" r="7" fill={cabelo} />
            <path
              d="M22 31 C22 18 29 12 40 12 C51 12 58 18 58 31 C55 23 49 19 40 19 C31 19 25 23 22 31 Z"
              fill={cabelo}
            />
          </>
        )}

        {variante === "bone" && (
          <>
            <path d="M22 30 C22 16 29 11 40 11 C51 11 58 16 58 30 Z" fill="#1e5c46" />
            <path d="M57 27 C68 26 73 29 73 33 C64 35 57 33 55 30 Z" fill="#123b2d" />
            <circle cx="40" cy="12" r="2.5" fill="#123b2d" stroke="none" />
          </>
        )}

        {variante === "lenco" && (
          <>
            <path d="M58 30 L71 26 L66 38 Z" fill={GEMA} />
            <path
              d="M21 33 C21 17 29 11 40 11 C51 11 59 17 59 33 C57 27 50 23 40 23 C30 23 23 27 21 33 Z"
              fill={GEMA}
            />
            <g fill="#fbf0dc" stroke="none">
              <circle cx="31" cy="20" r="1.8" />
              <circle cx="41" cy="16" r="1.8" />
              <circle cx="51" cy="20" r="1.8" />
            </g>
          </>
        )}

        {variante === "chapeu" && (
          <>
            <path d="M25 20 C25 7 31 3 40 3 C49 3 55 7 55 20 Z" fill="#eedbb0" />
            <ellipse cx="40" cy="21" rx="30" ry="7.5" fill="#e3c88f" />
            <path d="M26 18 C31 22 49 22 54 18" stroke={TERRA} strokeWidth="4" fill="none" />
          </>
        )}

        <g fill={TINTA} stroke="none">
          <circle cx="34" cy="30" r="2" />
          <circle cx="46" cy="30" r="2" />
        </g>

        {variante === "chapeu" ? (
          <>
            <path d="M32 37 C36 34 44 34 48 37 C44 41 36 41 32 37 Z" fill={cabelo} />
            <path d="M35 44 q5 4 10 0" fill="none" strokeWidth="2.2" strokeLinecap="round" />
          </>
        ) : (
          <path d="M34 38 q6 5 12 0" fill="none" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
}

/** Cesta de ovos da coleta da manhã. */
export function CestaDeOvos({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden="true">
      <g stroke={TINTA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M22 38 C22 25 50 25 50 38" fill="none" strokeWidth="3" />
        <ellipse cx="26" cy="35" rx="7.5" ry="9.5" fill="#ffffff" />
        <ellipse cx="36" cy="31" rx="7.5" ry="9.5" fill="#fbf0dc" />
        <ellipse cx="46" cy="35" rx="7.5" ry="9.5" fill="#ffffff" />
        <path d="M12 39 H60 L55 62 a5 5 0 0 1 -5 4 H22 a5 5 0 0 1 -5 -4 Z" fill="#cf9f63" />
        <path d="M16 49 H56 M18 57 H54" strokeWidth="1.8" opacity="0.45" />
      </g>
    </svg>
  );
}

/** Saco de ração — o gasto que acontece no meio da semana. */
export function SacoDeRacao({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden="true">
      <g stroke={TINTA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M20 25 C18 41 16 52 18 62 a4 4 0 0 0 4 4 H50 a4 4 0 0 0 4 -4 C56 52 54 41 52 25 Z"
          fill="#eae0c8"
        />
        <path d="M20 25 C30 19 42 19 52 25 L49 14 C41 10 31 10 23 14 Z" fill="#d9c9a4" />
        <rect x="26" y="36" width="20" height="19" rx="3" fill="#1e5c46" />
        <g stroke={GEMA} strokeWidth="2" fill="none">
          <path d="M36 40 V51 M36 43 l-3 -2 M36 43 l3 -2 M36 47 l-3 -2 M36 47 l3 -2" />
        </g>
      </g>
    </svg>
  );
}

/** Celular com o resumo do mês — o fechamento sem somar nada no papel. */
export function CelularResumo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden="true">
      <g stroke={TINTA} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <rect x="18" y="6" width="36" height="60" rx="7" fill="#ffffff" />
        <rect x="23" y="14" width="26" height="44" rx="3" fill="#e3f0ea" stroke="none" />
        <path d="M32 10 h8" strokeWidth="2" />
        <path d="M27 21 h13" strokeWidth="3" stroke="#a5a196" />
        <g stroke="none">
          <rect x="27" y="40" width="5" height="13" rx="2" fill="#1e5c46" />
          <rect x="34" y="33" width="5" height="20" rx="2" fill={GEMA} />
          <rect x="41" y="26" width="5" height="27" rx="2" fill="#1e5c46" />
        </g>
      </g>
    </svg>
  );
}
