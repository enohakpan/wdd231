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
        // Reset form to first step when opening modal
        currentStep = 1
        showStep(1)
        updateProgress()
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
    const mobileStepEl = document.querySelector(`#mobile-step-${step}`)
    
    if (window.innerWidth <= 768) {
      // Mobile view
      if (mobileStepEl) {
        mobileStepEl.classList.add("active")
      }
    } else {
      // Desktop view
      if (currentStepEl) {
        currentStepEl.classList.add("active")
      }
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
    const isMobile = window.innerWidth <= 768
    const prefix = isMobile ? "mobile-" : ""
    const currentStepEl = document.querySelector(`#${prefix}step-${currentStep}`)
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
    const isMobile = window.innerWidth <= 768
    const prefix = isMobile ? "mobile-" : ""

    // Collect form data
    const formData = new FormData()

    // Step 1 data
    formData.append("name", document.getElementById(`${prefix}contact-name`).value)
    formData.append("email", document.getElementById(`${prefix}contact-email`).value)
    formData.append("phone", document.getElementById(`${prefix}contact-phone`).value)

    // Step 2 data
    formData.append("subject", document.getElementById(`${prefix}contact-subject`).value)
    formData.append("category", document.getElementById(`${prefix}contact-category`).value)

    // Step 3 data
    formData.append("message", document.getElementById(`${prefix}contact-message`).value)
    formData.append("newsletter", document.getElementById(`${prefix}newsletter-signup`).checked)

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
        <button class="form-btn btn-next mt-2" id="sendAnotherBtn">Send Another Message</button>
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
    const isMobile = window.innerWidth <= 768
    const prefix = isMobile ? "mobile-" : ""
    
    document
      .querySelectorAll(`#${prefix}step-${currentStep} input, #${prefix}step-${currentStep} textarea, #${prefix}step-${currentStep} select`)
      .forEach((field) => {
        field.value = ""
        field.style.borderColor = "rgba(255, 255, 255, 0.3)"
      })
    
    document.getElementById(`${prefix}newsletter-signup`).checked = false
    showStep(1)
  }

  // Add event listener for send another button
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'sendAnotherBtn') {
      location.reload();
    }
  });
})
