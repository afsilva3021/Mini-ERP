/* Troque pelo IPv4 da maquina da API quando ela estiver em outro computador. */
window.APP_CONFIG = Object.assign({
  API_BASE_URL: `http://${window.location.hostname || "localhost"}:8080`,
  API_TOKEN: "",
  REQUEST_TIMEOUT_MS: 10000
}, window.APP_CONFIG || {});
