import { useEffect, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { iconeLogo } from "../icons";
import { ITENS_NAV } from "../navegacao";

interface AppShellProps {
  nome: string;
  aoSair: () => void;
  children: ReactNode;
}

const classesItemBase =
  "flex items-center gap-3 px-[14px] py-[13px] rounded-lg text-[14px] whitespace-nowrap cursor-pointer transition-colors";
const classesItemCompactaBase =
  "flex items-center gap-[6px] px-[9px] py-[8px] rounded-lg text-[12.5px] whitespace-nowrap cursor-pointer transition-colors";

function classesItem(ativo: boolean): string {
  return `${classesItemBase} ${ativo ? "bg-verde text-white font-medium" : "text-[#C4D6CC] hover:bg-white/[0.07]"}`;
}

function classesItemCompacta(ativo: boolean): string {
  return `${classesItemCompactaBase} ${ativo ? "bg-verde text-white font-medium" : "text-[#C4D6CC] hover:bg-white/[0.07]"}`;
}

const logoSvg = <span className="text-gema flex-shrink-0">{iconeLogo}</span>;

export function AppShell({ nome, aoSair, children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuAberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAberto]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Barra superior (mobile e tablet) / topo da sidebar (desktop) */}
      <div className="sticky top-0 z-40 lg:static flex items-center gap-3 bg-verde-escuro text-white px-4 py-2.5 lg:hidden">
        {logoSvg}
        <div className="leading-tight">
          <div className="font-heading font-semibold text-[14.5px]">Meu Galinheiro</div>
        </div>

        {/* Nav horizontal, só aparece no tablet (md a lg) */}
        <nav className="hidden md:flex flex-1 min-w-0 gap-0.5 overflow-x-auto ml-2">
          {ITENS_NAV.map((item) => (
            <NavLink key={item.id} to={item.caminho} end={item.caminho === "/app"} className={({ isActive }) => classesItemCompacta(isActive)}>
              <span className="w-4 h-4 flex-shrink-0">{item.icone}</span>
              <span>{item.rotulo}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuAberto((aberto) => !aberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          className="md:hidden ml-auto flex flex-col items-center justify-center gap-[5px] w-11 h-11 rounded-lg border border-white/20 flex-shrink-0"
        >
          <span
            className={`block w-5 h-0.5 bg-white rounded transition-transform duration-200 ${
              menuAberto ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span className={`block w-5 h-0.5 bg-white rounded transition-opacity duration-200 ${menuAberto ? "opacity-0" : ""}`} />
          <span
            className={`block w-5 h-0.5 bg-white rounded transition-transform duration-200 ${
              menuAberto ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Sair sempre alcançável no tablet, já que o rodapé da sidebar só aparece no desktop */}
        <button type="button" onClick={aoSair} className="hidden md:block text-[12px] underline flex-shrink-0 px-2 py-2">
          Sair
        </button>
      </div>

      {/* Overlay + drawer (só mobile, abaixo de md) */}
      {menuAberto && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setMenuAberto(false)}
          className="md:hidden fixed inset-0 bg-verde-escuro/55 backdrop-blur-[2px] z-40 cursor-default"
        />
      )}
      <nav
        id="menu-mobile"
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[280px] max-w-[86vw] bg-verde-escuro z-50 flex flex-col gap-[3px] px-[14px] py-5 overflow-y-auto shadow-[10px_0_34px_rgba(0,0,0,0.28)] transition-transform duration-300 ${
          menuAberto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-[10px] px-1 pb-[18px] mb-2 border-b border-white/10">
          {logoSvg}
          <div>
            <div className="font-heading font-semibold text-[15px] leading-tight">Meu Galinheiro</div>
            <div className="text-[10.5px] text-[#9DBAAC]">gestão simples da criação</div>
          </div>
        </div>
        {ITENS_NAV.map((item) => (
          <NavLink
            key={item.id}
            to={item.caminho}
            end={item.caminho === "/app"}
            onClick={() => setMenuAberto(false)}
            className={({ isActive }) => classesItem(isActive)}
          >
            <span className="w-5 h-5 flex-shrink-0">{item.icone}</span>
            <span>{item.rotulo}</span>
          </NavLink>
        ))}
        <div className="mt-auto pt-4 px-1 text-[12px] text-[#93B5A4] border-t border-white/10">
          {nome}
          <br />
          <button type="button" onClick={aoSair} className="underline cursor-pointer py-2 inline-block">
            Sair
          </button>
        </div>
      </nav>

      {/* Sidebar vertical (desktop, lg+) */}
      <aside className="hidden lg:flex lg:w-[232px] lg:h-screen lg:sticky lg:top-0 flex-col flex-shrink-0 bg-verde-escuro text-white py-7">
        <div className="flex items-center gap-[10px] px-6 pb-7">
          {logoSvg}
          <div>
            <div className="font-heading font-semibold text-base leading-tight">Meu Galinheiro</div>
            <div className="text-[10.5px] text-[#9DBAAC]">gestão simples da criação</div>
          </div>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          {ITENS_NAV.map((item) => (
            <NavLink key={item.id} to={item.caminho} end={item.caminho === "/app"} className={({ isActive }) => classesItem(isActive)}>
              <span className="w-[18px] h-[18px] flex-shrink-0">{item.icone}</span>
              <span>{item.rotulo}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 px-6 text-[11.5px] text-[#93B5A4]">
          {nome}
          <br />
          <button type="button" onClick={aoSair} className="underline cursor-pointer">
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 lg:px-10 lg:py-8 pb-14 max-w-[1200px] w-full">{children}</main>
    </div>
  );
}
