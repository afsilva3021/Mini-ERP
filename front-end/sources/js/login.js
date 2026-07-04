document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("loginMessage");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    message.classList.add("d-none");
    try {
      if (!window.api?.login) throw new Error("A integracao com a API nao esta disponivel.");
      const result = await window.api.login({
        email: form.elements.email.value.trim(),
        senha: form.elements.password.value
      });
      sessionStorage.setItem("miniErp.usuario", JSON.stringify(result.usuario || {}));
      location.href = "../dashboard.html";
    } catch (error) {
      message.textContent = error.message || "Nao foi possivel entrar.";
      message.classList.remove("d-none");
      button.disabled = false;
    }
  });
});

