export const environment = {
  // Note: Request the backend base URL via env injection. Do not hardcode.
  // The orchestrator should set NOTES_API_BASE_URL in the .env file and wire it at build if needed.
  apiBaseUrl: (globalThis as any)['NOTES_API_BASE_URL'] || '/api'
};
