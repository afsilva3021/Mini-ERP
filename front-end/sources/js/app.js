document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const desktopToggle = document.getElementById("toggleBtn");
  const mobileToggle = document.getElementById("mobileBtn");
  const overlay = document.getElementById("overlay");

  desktopToggle?.addEventListener("click", () => body.classList.toggle("sidebar-collapsed"));
  mobileToggle?.addEventListener("click", () => body.classList.toggle("sidebar-mobile-open"));
  overlay?.addEventListener("click", () => body.classList.remove("sidebar-mobile-open"));

  document.querySelectorAll("a[href='#'], a[href='#!']").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
    }, { once: true });
  });

  document.querySelectorAll("form:not(#loginForm)").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else if (!form.hasAttribute("action")) {
        event.preventDefault();
      }

      form.classList.add("was-validated");
    });
  });

  const banner = document.getElementById("offlineBanner") || document.createElement("div");
  let esteveOffline = false;
  let temporizadorBanner;

  banner.id = "offlineBanner";
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  if (!banner.isConnected) document.body.prepend(banner);

  const atualizarStatus = (online) => {
    clearTimeout(temporizadorBanner);

    if (!online) {
      esteveOffline = true;
      banner.className = "connection-banner connection-banner--offline";
      banner.textContent = "Sistema offline. Os dados serão salvos localmente e sincronizados quando a conexão voltar.";
      return;
    }

    if (esteveOffline) {
      banner.className = "connection-banner connection-banner--online";
      banner.textContent = "Conexão restaurada. Sincronizando dados pendentes...";
      esteveOffline = false;
      temporizadorBanner = setTimeout(() => {
        banner.className = "connection-banner";
        banner.textContent = "";
      }, 5000);
      return;
    }

    banner.className = "connection-banner";
    banner.textContent = "";
  };

  const statusInicial = window.api?.getOnlineStatus
    ? window.api.getOnlineStatus()
    : navigator.onLine;

  atualizarStatus(statusInicial);

  if (window.api?.onOnlineStatus) {
    window.api.onOnlineStatus(atualizarStatus);
  } else {
    window.addEventListener("online", () => atualizarStatus(true));
    window.addEventListener("offline", () => atualizarStatus(false));
  }
});
