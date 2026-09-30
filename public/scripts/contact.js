document.getElementById("contact-form")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const form = this;
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
  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  if (!firstName.value.trim()) {
    showValidationError(firstName, "Please enter your first name");
    valid = false;
  }
  if (!lastName.value.trim()) {
    showValidationError(lastName, "Please enter your last name");
    valid = false;
  }
  if (!email.value.trim() || !window.validateEmail(email.value)) {
    showValidationError(email, "Please enter a valid email address");
    valid = false;
  }
  if (!subject.value) {
    showValidationError(subject, "Please select a subject");
    valid = false;
  }
  if (!message.value.trim()) {
    showValidationError(message, "Please enter your message");
    valid = false;
  }

  if (!valid) return;

  // Show loading
  if (loading) loading.style.display = "flex";

  // Simulate form submission
  setTimeout(() => {
    if (loading) loading.style.display = "none";
    if (notification) {
      notification.hidden = false;
      notification.classList.add("show");
    }
    form.reset();

    setTimeout(() => {
      if (notification) {
        notification.classList.remove("show");
        notification.hidden = true;
      }
    }, 3000);
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