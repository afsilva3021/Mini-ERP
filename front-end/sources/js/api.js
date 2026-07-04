(function () {
  "use strict";
  const config = window.APP_CONFIG || {};
  const queryUrl = new URLSearchParams(location.search).get("api");
  if (queryUrl) localStorage.setItem("miniErp.apiBaseUrl", queryUrl);
  const baseUrl = String(queryUrl || localStorage.getItem("miniErp.apiBaseUrl") || config.API_BASE_URL || "")
    .trim().replace(/\/$/, "");

  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(config.REQUEST_TIMEOUT_MS) || 10000);
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");
    if (options.body) headers.set("Content-Type", "application/json");
    if (config.API_TOKEN) headers.set("Authorization", `Bearer ${config.API_TOKEN}`);
    try {
      const response = await fetch(`${baseUrl}${path}`, { ...options, headers, signal: controller.signal });
      const data = (response.headers.get("content-type") || "").includes("application/json")
        ? await response.json() : { message: await response.text() };
      if (!response.ok || data?.status === false) {
        const details = data?.errors && typeof data.errors === "object" ? Object.values(data.errors).join(" ") : "";
        throw new Error(details || data?.message || `Erro HTTP ${response.status}.`);
      }
      return data;
    } catch (error) {
      if (error.name === "AbortError") throw new Error("A API demorou demais para responder.");
      if (error instanceof TypeError) throw new Error(`Nao foi possivel acessar a API em ${baseUrl}. Verifique IP, porta e CORS.`);
      throw error;
    } finally { clearTimeout(timeout); }
  }

  window.api = {
    baseUrl,
    login: (body) => request("/login", { method: "POST", body: JSON.stringify(body) }),
    cadastrarUsuario: (body) => request("/usuarios", { method: "POST", body: JSON.stringify(body) }),
    listarProdutos: async () => (await request("/produtos")).data || [],
    criarProduto: (body) => request("/produto", { method: "POST", body: JSON.stringify(body) }),
    atualizarProduto: (id, body) => request(`/produto/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(body) }),
    excluirProduto: (id) => request(`/produto/${encodeURIComponent(id)}`, { method: "DELETE" }),
    getOnlineStatus: () => navigator.onLine,
    onOnlineStatus: (callback) => {
      addEventListener("online", () => callback(true));
      addEventListener("offline", () => callback(false));
    }
  };
})();

