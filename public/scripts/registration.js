document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".form-slide");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressLabels = document.querySelectorAll(".progress-label");
  const progressFill = document.getElementById("progress-fill");
  const form = document.getElementById("registration-form");
  const loading = document.getElementById("loading");
  let currentStep = 1;
  const totalSteps = progressSteps.length;

  // Progress navigation
  function updateProgress(step) {
    // Update progress bar fill
    if (progressFill) {
      progressFill.style.width = ((step - 1) / (totalSteps - 1)) * 100 + "%";
      progressFill.setAttribute("aria-valuenow", Math.round(((step - 1) / (totalSteps - 1)) * 100));
    }

    // Update step indicators
    progressSteps.forEach((stepEl, idx) => {
      if (idx + 1 < step) {
        stepEl.classList.remove("active");
        stepEl.classList.add("completed");
        stepEl.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';
        stepEl.setAttribute("aria-label", `Step ${idx + 1}: Completed`);
      } else if (idx + 1 === step) {
        stepEl.classList.add("active");
        stepEl.classList.remove("completed");
        stepEl.innerHTML = step;
        stepEl.setAttribute("aria-label", `Step ${step}: Current`);
      } else {
        stepEl.classList.remove("active", "completed");
        stepEl.innerHTML = idx + 1;
        stepEl.setAttribute("aria-label", `Step ${idx + 1}: Pending`);
      }
    });

    // Update step labels
    progressLabels.forEach((label, idx) => {
      if (idx + 1 === step) {
        label.classList.add("active");
        label.setAttribute("aria-selected", "true");
      } else {
        label.classList.remove("active");
        label.setAttribute("aria-selected", "false");
      }
    });

    // Show current step
    steps.forEach((stepEl, idx) => {
      if (idx + 1 === step) {
        stepEl.classList.add("active");
        stepEl.hidden = false;
      } else {
        stepEl.classList.remove("active");
        stepEl.hidden = true;
      }
    });
  }

  // Show validation error
  function showValidationError(input, message) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", `${input.id}-error`);
    // Remove existing error message first
    const existingError = input.parentElement.querySelector(".invalid-feedback");
    if (existingError) existingError.remove();
    const error = document.createElement("div");
    error.className = "invalid-feedback";
    error.id = `${input.id}-error`;
    error.innerHTML = `<i class="fas fa-exclamation-circle" aria-hidden="true"></i> ${message}`;
    input.parentElement.appendChild(error);
  }

  // Clear validation errors
  function clearValidationErrors() {
    const invalidInputs = document.querySelectorAll(".is-invalid");
    invalidInputs.forEach((input) => {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
      const feedback = input.parentElement.querySelector(".invalid-feedback");
      if (feedback) feedback.remove();
    });
  }

  // Email validation
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Populate semester options based on year
  function populateSemesters(year, semInput) {
    semInput.innerHTML = '<option value="">Select Semester</option>';
    if (year === "1") {
      semInput.innerHTML += '<option value="1">1st Semester</option>';
      semInput.innerHTML += '<option value="2">2nd Semester</option>';
    } else if (year === "2") {
      semInput.innerHTML += '<option value="3">3rd Semester</option>';
      semInput.innerHTML += '<option value="4">4th Semester</option>';
    } else if (year === "3") {
      semInput.innerHTML += '<option value="5">5th Semester</option>';
      semInput.innerHTML += '<option value="6">6th Semester</option>';
    } else if (year === "4") {
      semInput.innerHTML += '<option value="7">7th Semester</option>';
      semInput.innerHTML += '<option value="8">8th Semester</option>';
    }
  }

  // Populate subject options based on course and semester
  function populateSubjects(course, sem, subjectInput) {
    subjectInput.innerHTML = '<option value="">Select Subjects</option>';
    subjectInput.disabled = false;

    const subjects = {
      "cse": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["chem", "Engineering Chemistry"], ["prog", "Programming Fundamentals"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["dsa", "Data Structures & Algorithms"], ["digital", "Digital Electronics"], ["oop", "Object Oriented Programming"], ["comm", "Communication Skills"]],
        "3": [["dbms", "Database Management Systems"], ["os", "Operating Systems"], ["cn", "Computer Networks"], ["daa", "Design & Analysis of Algorithms"], ["web", "Web Technologies"]],
        "4": [["se", "Software Engineering"], ["ai", "Artificial Intelligence"], ["ml", "Machine Learning"], ["cloud", "Cloud Computing"], ["cyber", "Cyber Security"]],
        "5": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "6": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "7": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "8": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]]
      },
      "ds-ai": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["chem", "Engineering Chemistry"], ["prog", "Programming Fundamentals"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["dsa", "Data Structures & Algorithms"], ["digital", "Digital Electronics"], ["oop", "Object Oriented Programming"], ["comm", "Communication Skills"]],
        "3": [["dbms", "Database Management Systems"], ["os", "Operating Systems"], ["cn", "Computer Networks"], ["daa", "Design & Analysis of Algorithms"], ["web", "Web Technologies"]],
        "4": [["se", "Software Engineering"], ["ai", "Artificial Intelligence"], ["ml", "Machine Learning"], ["cloud", "Cloud Computing"], ["cyber", "Cyber Security"]],
        "5": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "6": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "7": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]],
        "8": [["ds", "Distributed Systems"], ["nlp", "Natural Language Processing"], ["iot", "Internet of Things"], ["blockchain", "Blockchain Technologies"], ["proj", "Capstone Project"]]
      },
      "electrical": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["circuits", "Electric Circuits"], ["prog", "Programming Fundamentals"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["physics2", "Engineering Physics II"], ["circuits2", "Electric Circuits II"], ["prog2", "Programming Fundamentals II"], ["eng2", "Technical English II"]],
        "3": [["emag", "Electromagnetic Fields"], ["signals", "Signals & Systems"], ["digital", "Digital Electronics"], ["control", "Control Systems"], ["power", "Power Electronics"]],
        "4": [["emag2", "Electromagnetic Fields II"], ["signals2", "Signals & Systems II"], ["digital2", "Digital Electronics II"], ["control2", "Control Systems II"], ["power2", "Power Electronics II"]],
        "5": [["advanced", "Advanced Electrical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "6": [["advanced", "Advanced Electrical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "7": [["advanced", "Advanced Electrical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "8": [["advanced", "Advanced Electrical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]]
      },
      "electronics": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["circuits", "Electric Circuits"], ["prog", "Programming Fundamentals"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["physics2", "Engineering Physics II"], ["circuits2", "Electric Circuits II"], ["prog2", "Programming Fundamentals II"], ["eng2", "Technical English II"]],
        "3": [["emag", "Electromagnetic Fields"], ["signals", "Signals & Systems"], ["digital", "Digital Electronics"], ["control", "Control Systems"], ["power", "Power Electronics"]],
        "4": [["emag2", "Electromagnetic Fields II"], ["signals2", "Signals & Systems II"], ["digital2", "Digital Electronics II"], ["control2", "Control Systems II"], ["power2", "Power Electronics II"]],
        "5": [["advanced", "Advanced Electronics Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "6": [["advanced", "Advanced Electronics Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "7": [["advanced", "Advanced Electronics Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "8": [["advanced", "Advanced Electronics Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]]
      },
      "civil": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["graphics", "Engineering Graphics"], ["mechanics", "Engineering Mechanics"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["physics2", "Engineering Physics II"], ["graphics2", "Engineering Graphics II"], ["mechanics2", "Engineering Mechanics II"], ["eng2", "Technical English II"]],
        "3": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "4": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "5": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "6": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "7": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "8": [["advanced", "Advanced Civil Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]]
      },
      "mechanical": {
        "1": [["math1", "Engineering Mathematics I"], ["physics", "Engineering Physics"], ["graphics", "Engineering Graphics"], ["mechanics", "Engineering Mechanics"], ["eng", "Technical English"]],
        "2": [["math2", "Engineering Mathematics II"], ["physics2", "Engineering Physics II"], ["graphics2", "Engineering Graphics II"], ["mechanics2", "Engineering Mechanics II"], ["eng2", "Technical English II"]],
        "3": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "4": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "5": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "6": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "7": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]],
        "8": [["advanced", "Advanced Mechanical Course"], ["elective1", "Elective 1"], ["elective2", "Elective 2"], ["elective3", "Elective 3"]]
      }
    };

    if (subjects[course] && subjects[course][sem]) {
      subjects[course][sem].forEach(([value, label]) => {
        subjectInput.innerHTML += `<option value="${value}">${label}</option>`;
      });
    }
  }

  // Password strength meter
  function updatePasswordStrength(password) {
    const meter = document.querySelector(".pw-meter");
    if (!meter) return;
    let level = 0;
    if (password.length >= 8) level++;
    if (/[A-Z]/.test(password)) level++;
    if (/[0-9]/.test(password)) level++;
    if (/[^A-Za-z0-9]/.test(password)) level++;
    meter.dataset.level = Math.min(level, 4);
    meter.setAttribute("aria-valuenow", level);
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

  // Password strength on input
  const pwInput = document.getElementById("password");
  if (pwInput) {
    pwInput.addEventListener("input", () => updatePasswordStrength(pwInput.value));
  }

  // Initialize form navigation if form exists
  if (form) {
    // Next and Previous button handlers
    const nextStep1 = document.getElementById("next-step-1");
    if (nextStep1) {
      nextStep1.addEventListener("click", function () {
        clearValidationErrors();
        const nameInput = document.getElementById("student-name");
        const enrollmentInput = document.getElementById("enrollment-number");
        const emailInput = document.getElementById("email");

        let valid = true;
        if (!nameInput.value.trim()) {
          showValidationError(nameInput, "Please enter your name");
          valid = false;
        }
        if (!enrollmentInput.value.trim()) {
          showValidationError(enrollmentInput, "Please enter your enrollment number");
          valid = false;
        }
        if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
          showValidationError(emailInput, "Please enter a valid email address");
          valid = false;
        }
        if (valid) {
          currentStep = 2;
          updateProgress(currentStep);
        }
      });
    }

    const prevStep2 = document.getElementById("prev-step-2");
    if (prevStep2) {
      prevStep2.addEventListener("click", function () {
        clearValidationErrors();
        currentStep = 1;
        updateProgress(currentStep);
      });
    }

    const nextStep2 = document.getElementById("next-step-2");
    if (nextStep2) {
      nextStep2.addEventListener("click", function () {
        clearValidationErrors();
        const courseInput = document.getElementById("course");
        if (!courseInput.value) {
          showValidationError(courseInput, "Please select a course");
          return;
        }
        currentStep = 3;
        updateProgress(currentStep);
      });
    }

    const prevStep3 = document.getElementById("prev-step-3");
    if (prevStep3) {
      prevStep3.addEventListener("click", function () {
        clearValidationErrors();
        currentStep = 2;
        updateProgress(currentStep);
      });
    }

    const nextStep3 = document.getElementById("next-step-3");
    if (nextStep3) {
      nextStep3.addEventListener("click", function () {
        clearValidationErrors();
        const yearInput = document.getElementById("year");
        const semInput = document.getElementById("sem");
        if (!yearInput.value) {
          showValidationError(yearInput, "Please select your year");
          return;
        }
        if (semInput) populateSemesters(yearInput.value, semInput);
        currentStep = 4;
        updateProgress(currentStep);
      });
    }

    const prevStep4 = document.getElementById("prev-step-4");
    if (prevStep4) {
      prevStep4.addEventListener("click", function () {
        clearValidationErrors();
        currentStep = 3;
        updateProgress(currentStep);
      });
    }

    const submitForm = document.getElementById("submit-form");
    if (submitForm) {
      submitForm.addEventListener("click", function (event) {
        event.preventDefault();
        clearValidationErrors();
        const semInput = document.getElementById("sem");
        const subjectInput = document.getElementById("subject");

        let valid = true;
        if (!semInput.value) {
          showValidationError(semInput, "Please select a semester");
          valid = false;
        }
        if (!subjectInput.value || subjectInput.selectedOptions.length === 0) {
          showValidationError(subjectInput, "Please select at least one subject");
          valid = false;
        }
        if (!valid) return;

        // Show loading spinner
        if (loading) loading.style.display = "flex";

        // Simulate form submission
        setTimeout(() => {
          if (loading) loading.style.display = "none";
          const notification = document.getElementById("notification");
          if (notification) {
            notification.hidden = false;
            notification.classList.add("show");
            setTimeout(() => {
              notification.classList.remove("show");
              notification.hidden = true;
            }, 3000);
          }
          form.reset();
          currentStep = 1;
          updateProgress(currentStep);
          // Reset semester and subject dropdowns
          const semReset = document.getElementById("sem");
          const subReset = document.getElementById("subject");
          if (semReset) {
            semReset.innerHTML = '<option value="">-- First Select Year --</option>';
            semReset.disabled = true;
          }
          if (subReset) {
            subReset.innerHTML = '<option value="">Select Subjects</option>';
            subReset.disabled = true;
          }
        }, 2000);
      });
    }

    // Initialize semester options based on year selection
    const yearInput = document.getElementById("year");
    if (yearInput) {
      yearInput.addEventListener("change", function () {
        const semInput = document.getElementById("sem");
        const subjectInput = document.getElementById("subject");
        if (semInput) populateSemesters(this.value, semInput);
        if (subjectInput) {
          subjectInput.innerHTML = '<option value="">Select Subjects</option>';
          subjectInput.disabled = true;
        }
      });
    }

    // Initialize subject options based on semester selection
    const semInput = document.getElementById("sem");
    if (semInput) {
      semInput.addEventListener("change", function () {
        const courseInput = document.getElementById("course");
        const subjectInput = document.getElementById("subject");
        if (courseInput && subjectInput && this.value) {
          populateSubjects(courseInput.value, this.value, subjectInput);
        }
      });
    }

    // Update subjects when course changes
    const courseInput = document.getElementById("course");
    if (courseInput) {
      courseInput.addEventListener("change", function () {
        const semInput = document.getElementById("sem");
        const subjectInput = document.getElementById("subject");
        if (semInput && subjectInput && semInput.value) {
          populateSubjects(this.value, semInput.value, subjectInput);
        }
      });
    }
  }
});