// / <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /** Firebase Cloud Functions API base URL */
  readonly VITE_API_URL: string;
  /** Alternative Firebase Functions URL (used by some test routes) */
  readonly VITE_FIREBASE_FUNCTIONS_URL?: string;

  readonly VITE_USE_EMULATOR?: string;
}
