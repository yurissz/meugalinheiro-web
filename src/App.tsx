import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppAutenticado } from "./AppAutenticado";
import { LandingPage } from "./features/landing/LandingPage";
const DashboardPage = lazy(() =>
  import("./features/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const LotesPage = lazy(() => import("./features/lote/LotesPage").then((m) => ({ default: m.LotesPage })));
const RegistroPage = lazy(() =>
  import("./features/registro/RegistroPage").then((m) => ({ default: m.RegistroPage })),
);
const FinanceiroPage = lazy(() =>
  import("./features/transacao/FinanceiroPage").then((m) => ({ default: m.FinanceiroPage })),
);
const MortalidadePage = lazy(() =>
  import("./features/mortalidade/MortalidadePage").then((m) => ({ default: m.MortalidadePage })),
);
const VacinacaoPage = lazy(() =>
  import("./features/vacinacao/VacinacaoPage").then((m) => ({ default: m.VacinacaoPage })),
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<AppAutenticado />}>
        <Route index element={<DashboardPage />} />
        <Route path="lotes" element={<LotesPage />} />
        {/* O cadastro de lote virou overlay sobre a listagem: link antigo cai na lista. */}
        <Route path="lotes/novo" element={<Navigate to="/app/lotes" replace />} />
        <Route path="lotes/:id/editar" element={<Navigate to="/app/lotes" replace />} />
        <Route path="registro" element={<RegistroPage />} />
        <Route path="financeiro" element={<FinanceiroPage />} />
        <Route path="mortalidade" element={<MortalidadePage />} />
        <Route path="vacinas" element={<VacinacaoPage />} />
        {/* URL digitada errada dentro do app volta pro painel em vez de tela em branco */}
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
