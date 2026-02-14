/* =========================================
   ADNOW - FORM MODULE
   Handles form functionality and validation
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
  initSellerForm();
});

/**
 * Initialize seller registration form
 */
function initSellerForm() {
  const form = document.getElementById('seller-registration-form');
  
  if (!form) return;
  
  // Character counter for description
  initCharacterCounter();
  
  // Set timestamp on form submit
  form.addEventListener('submit', handleFormSubmit);
  
  // Real-time validation
  initRealTimeValidation(form);
}

/**
 * Initialize character counter for description textarea
 */
function initCharacterCounter() {
  const description = document.getElementById('description');
  const counter = document.getElementById('desc-count');
  
  if (!description || !counter) return;
  
  description.addEventListener('input', () => {
    const count = description.value.length;
    counter.textContent = count;
    
    // Visual feedback
    if (count < 50) {
      counter.style.color = 'var(--error-red)';
    } else if (count > 450) {
      counter.style.color = 'var(--warning-yellow)';
    } else {
      counter.style.color = 'var(--secondary-green)';
    }
  });
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
  const form = e.target;
  
  // Set timestamp
  const timestampInput = document.getElementById('timestamp');
  if (timestampInput) {
    timestampInput.value = new Date().toISOString();
  }
  
  // Validate form
  if (!validateForm(form)) {
    e.preventDefault();
    return;
  }
  
  // Save to localStorage for demonstration
  saveFormDataToStorage(form);
}

/**
 * Validate form before submission
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean} True if valid
 */
function validateForm(form) {
  let isValid = true;
  
  // Check required fields
  const requiredFields = form.querySelectorAll('[required]');
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      showFieldError(field, 'This field is required');
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });
  
  // Validate email
  const email = form.querySelector('#email');
  if (email && email.value && !isValidEmail(email.value)) {
    showFieldError(email, 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate WhatsApp number
  const whatsapp = form.querySelector('#whatsapp');
  if (whatsapp && whatsapp.value && !isValidPhone(whatsapp.value)) {
    showFieldError(whatsapp, 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Validate description length
  const description = form.querySelector('#description');
  if (description && description.value.length < 50) {
    showFieldError(description, 'Description must be at least 50 characters');
    isValid = false;
  }
  
  // Check terms agreement
  const terms = form.querySelector('#terms');
  if (terms && !terms.checked) {
    showFieldError(terms, 'You must agree to the terms');
    isValid = false;
  }
  
  return isValid;
}

/**
 * Initialize real-time validation
 * @param {HTMLFormElement} form - Form element
 */
function initRealTimeValidation(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error on input
      clearFieldError(input);
    });
  });
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Form field
 */
function validateField(field) {
  const value = field.value.trim();
  
  // Required check
  if (field.required && !value) {
    showFieldError(field, 'This field is required');
    return;
  }
  
  // Email validation
  if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Please enter a valid email address');
    return;
  }
  
  // Phone validation
  if (field.type === 'tel' && value && !isValidPhone(value)) {
    showFieldError(field, 'Please enter a valid phone number');
    return;
  }
  
  // Minlength validation
  if (field.minLength > 0 && value.length < field.minLength) {
    showFieldError(field, `Minimum ${field.minLength} characters required`);
    return;
  }
  
  clearFieldError(field);
}

/**
 * Show error message for field
 * @param {HTMLElement} field - Form field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
  const formGroup = field.closest('.form-group') || field.closest('.checkbox-label');
  
  if (!formGroup) return;
  
  // Remove existing error
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error class
  field.classList.add('error');
  
  // Create error message
  const errorDiv = document.createElement('span');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.cssText = 'color: var(--error-red); font-size: 0.8rem; display: block; margin-top: 0.25rem;';
  
  formGroup.appendChild(errorDiv);
}

/**
 * Clear error message for field
 * @param {HTMLElement} field - Form field
 */
function clearFieldError(field) {
  const formGroup = field.closest('.form-group') || field.closest('.checkbox-label');
  
  if (!formGroup) return;
  
  field.classList.remove('error');
  
  const existingError = formGroup.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Save form data to localStorage
 * @param {HTMLFormElement} form - Form element
 */
function saveFormDataToStorage(form) {
  const formData = new FormData(form);
  const data = {};
  
  formData.forEach((value, key) => {
    data[key] = value;
  });
  
  // Get existing submissions
  const submissions = JSON.parse(localStorage.getItem('adnow_submissions') || '[]');
  
  // Add new submission
  submissions.push({
    ...data,
    submittedAt: new Date().toISOString()
  });
  
  // Save to localStorage
  localStorage.setItem('adnow_submissions', JSON.stringify(submissions));
  
  console.log('Form data saved to localStorage');
}