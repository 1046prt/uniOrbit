document.getElementById("login-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const notification = document.getElementById("notification");
  const loading = document.getElementById("loading");

  // Clear previous errors
  form.querySelectorAll(".is-invalid").forEach(el => {
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
    el.removeAttribute("aria-describedby");
  });
  form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());

  // Simple validation
  let valid = true;
  if (!username.value.trim()) {
    showValidationError(username, "Please enter your username or email");
    valid = false;
  }
  if (!password.value) {
    showValidationError(password, "Please enter your password");
    valid = false;
  }
  if (!valid) return;

  // Show loading
  if (loading) loading.style.display = "flex";

  // Simulate login process
  setTimeout(() => {
    if (loading) loading.style.display = "none";
    if (notification) {
      notification.hidden = false;
      notification.classList.add("show");
    }

    // Redirect to dashboard after successful login
    setTimeout(() => {
      if (notification) {
        notification.classList.remove("show");
        notification.hidden = true;
      }
      window.location.href = "/course-registration";
    }, 2000);
  }, 1500);
});

function showValidationError(input, message) {
  input.classList.add("is-invalid");
  input.setAttribute("aria-invalid", "true");
  input.setAttribute("aria-describedby", `${input.id}-error`);
  const existingError = input.parentElement.querySelector(".invalid-feedback");
  if (existingError) existingError.remove();
  const error = document.createElement("div");
  error.className = "invalid-feedback";
  error.id = `${input.id}-error`;
  error.innerHTML = `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}`;
  input.parentElement.appendChild(error);
}

// Password toggle
document.querySelectorAll(".pw-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = btn.closest(".input-icon").querySelector("input");
    const icon = btn.querySelector("i");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
      btn.setAttribute("aria-label", "Hide password");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
      btn.setAttribute("aria-label", "Show password");
    }
  });
});