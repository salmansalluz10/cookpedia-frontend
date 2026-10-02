declare global {
  interface Window {
    COOKPEDIA_CONFIG?: { apiUrl?: string };
  }
}
export const API_URL = (
  window.COOKPEDIA_CONFIG?.apiUrl ||
  'https://cookpedia-server-8mz5.onrender.com'
).replace(/\/$/, '');
