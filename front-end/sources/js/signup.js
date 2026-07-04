document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const message = document.getElementById("signupMessage");
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    try {
      await window.api.cadastrarUsuario({
        nome: form.elements.fullName.value.trim(),
        email: form.elements.email.value.trim(),
        senha: form.elements.password.value
      });
      message.className = "alert alert-success mt-3";
      message.textContent = "Cadastro realizado. Redirecionando para o login...";
      setTimeout(() => { location.href = "auth/login.html"; }, 900);
    } catch (error) {
      message.className = "alert alert-danger mt-3";
      message.textContent = error.message || "Nao foi possivel concluir o cadastro.";
      button.disabled = false;
    }
  });
});
