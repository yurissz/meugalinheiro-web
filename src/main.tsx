import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './shared/styles/tokens.css'
import App from './App.tsx'
import { AuthProvider } from './features/auth/AuthContext.tsx'
import { NotificacaoProvider } from './shared/notificacao/NotificacaoProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificacaoProvider>
          <App />
        </NotificacaoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
