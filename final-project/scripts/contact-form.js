// Footer Contact Form JavaScript
document.addEventListener("DOMContentLoaded", () => {
  let currentStep = 1
  const totalSteps = 3

  // Initialize form
  initializeContactForm()

  function initializeContactForm() {
    // Show first step
    showStep(1)
    updateProgress()

    // Add event listeners
    document.addEventListener("click", handleFormNavigation)
    document.addEventListener("input", handleFormInput)

    // Mobile contact button
    const mobileBtn = document.querySelector(".mobile-contact-btn")
    const modal = document.querySelector(".contact-form-modal")
    const closeBtn = document.querySelector(".modal-close-btn")

    if (mobileBtn) {
      mobileBtn.addEventListener("click", () => {
        modal.classList.add("active")
        document.body.style.overflow = "hidden"
      })
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.classList.remove("active")
        document.body.style.overflow = ""
      })
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.remove("active")
          document.body.style.overflow = ""
        }
      })
    }
  }

  function handleFormNavigation(e) {
    if (e.target.classList.contains("btn-next")) {
      e.preventDefault()
      if (validateCurrentStep()) {
        nextStep()
      }
    } else if (e.target.classList.contains("btn-back")) {
      e.preventDefault()
      prevStep()
    } else if (e.target.classList.contains("btn-submit")) {
      e.preventDefault()
      if (validateCurrentStep()) {
        submitForm()
      }
    }
  }

  function handleFormInput(e) {
    if (e.target.tagName === "TEXTAREA") {
      updateCharCount(e.target)
    }
  }

  function showStep(step) {
    // Hide all steps
    document.querySelectorAll(".contact-form-step").forEach((stepEl) => {
      stepEl.classList.remove("active")
    })

    // Show current step
    const currentStepEl = document.querySelector(`#step-${step}`)
    if (currentStepEl) {
      currentStepEl.classList.add("active")
    }

    currentStep = step
    updateProgress()
  }

  function nextStep() {
    if (currentStep < totalSteps) {
      showStep(currentStep + 1)
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      showStep(currentStep - 1)
    }
  }

  function updateProgress() {
    document.querySelectorAll(".progress-dot").forEach((dot, index) => {
      if (index < currentStep) {
        dot.classList.add("active")
      } else {
        dot.classList.remove("active")
      }
    })
  }

  function validateCurrentStep() {
    const currentStepEl = document.querySelector(`#step-${currentStep}`)
    const requiredFields = currentStepEl.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = "#ff4444"
        isValid = false
      } else {
        field.style.borderColor = "rgba(255, 255, 255, 0.3)"
      }
    })

    return isValid
  }

  function updateCharCount(textarea) {
    const maxLength = textarea.getAttribute("maxlength")
    const currentLength = textarea.value.length
    const charCountEl = textarea.parentNode.querySelector(".char-count")

    if (charCountEl && maxLength) {
      charCountEl.textContent = `${currentLength}/${maxLength}`
    }
  }

  function submitForm() {
    // Collect form data
    const formData = new FormData()

    // Step 1 data
    formData.append("name", document.getElementById("contact-name").value)
    formData.append("email", document.getElementById("contact-email").value)
    formData.append("phone", document.getElementById("contact-phone").value)

    // Step 2 data
    formData.append("subject", document.getElementById("contact-subject").value)
    formData.append("category", document.getElementById("contact-category").value)

    // Step 3 data
    formData.append("message", document.getElementById("contact-message").value)
    formData.append("newsletter", document.getElementById("newsletter-signup").checked)

    // Show loading state
    const submitBtn = document.querySelector(".btn-submit")
    const originalText = submitBtn.textContent
    submitBtn.textContent = "Sending..."
    submitBtn.disabled = true

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
      showSuccessMessage()
      resetForm()
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    }, 2000)
  }

  function showSuccessMessage() {
    const formContainer = document.querySelector(".footer-contact-form")
    const modalContainer = document.querySelector(".contact-form-modal-content")

    const successHTML = `
      <div class="form-success">
        <i class="fas fa-check-circle"></i>
        <h4>Message Sent Successfully!</h4>
        <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
        <button class="form-btn btn-next" onclick="location.reload()" style="margin-top: 1rem;">Send Another Message</button>
      </div>
    `

    if (window.innerWidth <= 768) {
      modalContainer.innerHTML = successHTML
    } else {
      formContainer.innerHTML = successHTML
    }
  }

  function resetForm() {
    currentStep = 1
    document
      .querySelectorAll(".contact-form-step input, .contact-form-step textarea, .contact-form-step select")
      .forEach((field) => {
        field.value = ""
        field.style.borderColor = "rgba(255, 255, 255, 0.3)"
      })
    document.getElementById("newsletter-signup").checked = false
    showStep(1)
  }
})
