import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./features/auth/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { AppShell } from "./shared/components/AppShell";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { Skeleton } from "./shared/components/Skeleton";

function CarregandoTela() {
  return (
    <div>
      <Skeleton className="h-[108px] w-full rounded-app mb-6" />
      <Skeleton className="h-4 w-40 mb-3" />
      <Skeleton className="h-[200px] w-full rounded-app" />
    </div>
  );
}

// Tudo que fica atrás de login, montado em /app. Cada tela filha tem a própria rota
// (ver App.tsx); aqui fica só a guarda de sessão e a casca com o menu.
export function AppAutenticado() {
  const { sessao, sair } = useAuth();
  const local = useLocation();

  if (!sessao) {
    return <LoginPage />;
  }

  return (
    <AppShell nome={sessao.nome} aoSair={sair}>
      {/* key por rota: um erro numa tela não contamina a próxima que o usuário abrir */}
      <ErrorBoundary key={local.pathname}>
        <Suspense fallback={<CarregandoTela />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </AppShell>
  );
}
