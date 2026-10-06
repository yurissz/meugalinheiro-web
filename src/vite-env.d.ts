/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base da API (ex.: http://localhost:8081). Definida em .env / no painel do host. */
  readonly VITE_API_URL?: string;
  /**
   * Endereço público deste site (ex.: https://meugalinheiro.vercel.app), sem barra no fim.
   * Usado só no build, pra montar as URLs absolutas de og:image/og:url no index.html.
   */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
