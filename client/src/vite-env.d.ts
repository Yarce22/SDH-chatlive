/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string;
  readonly VITE_SERVER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}