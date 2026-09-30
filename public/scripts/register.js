document.getElementById("register-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
  const pwInput = document.getElementById("password");
  const confirmInput = document.getElementById("confirm-password");
  const notification = document.getElementById("notification");
  const loading = document.getElementById("loading");

  // Clear previous errors
  form.querySelectorAll(".is-invalid").forEach(el => {
    el.classList.remove("is-invalid");
    el.removeAttribute("aria-invalid");
    el.removeAttribute("aria-describedby");
  });
  form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());

  // Validation
  let valid = true;

  // Password match
  if (pwInput.value !== confirmInput.value) {
    showValidationError(confirmInput, "Passwords do not match!");
    valid = false;
  }

  // Password strength
  if (pwInput.value.length < 8) {
    showValidationError(pwInput, "Password must be at least 8 characters long!");
    valid = false;
  }

  if (!/[A-Z]/.test(pwInput.value)) {
    showValidationError(pwInput, "Password must contain at least one uppercase letter");
    valid = false;
  }

  if (!/[0-9]/.test(pwInput.value)) {
    showValidationError(pwInput, "Password must contain at least one number");
    valid = false;
  }

  if (!/[^A-Za-z0-9]/.test(pwInput.value)) {
    showValidationError(pwInput, "Password must contain at least one special character");
    valid = false;
  }

  if (!valid) return;

  // Show loading
  if (loading) loading.style.display = "flex";

  // Simulate registration process
  setTimeout(() => {
    if (loading) loading.style.display = "none";
    if (notification) {
      notification.hidden = false;
      notification.classList.add("show");
    }
    form.reset();

    // Reset password meter
    const meter = document.querySelector(".pw-meter");
    if (meter) {
      meter.dataset.level = 0;
      meter.setAttribute("aria-valuenow", 0);
    }

    // Redirect to login after successful registration
    setTimeout(() => {
      if (notification) {
        notification.classList.remove("show");
        notification.hidden = true;
      }
      window.location.href = "/login";
    }, 2000);
  }, 2000);
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

// Password strength meter
const pwInput = document.getElementById("password");
const meter = document.querySelector(".pw-meter");
if (pwInput && meter) {
  pwInput.addEventListener("input", function () {
    let level = 0;
    if (this.value.length >= 8) level++;
    if (/[A-Z]/.test(this.value)) level++;
    if (/[0-9]/.test(this.value)) level++;
    if (/[^A-Za-z0-9]/.test(this.value)) level++;
    meter.dataset.level = Math.min(level, 4);
    meter.setAttribute("aria-valuenow", level);
  });
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