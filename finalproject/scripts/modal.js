/* =========================================
   ADNOW - MODAL MODULE
   Handles modal dialog functionality
   ========================================= */

let modal = null;
let modalBody = null;
let closeBtn = null;
let overlay = null;

/**
 * Initialize modal functionality
 */
export function initModal() {
  modal = document.getElementById('seller-modal');
  
  if (!modal) return;
  
  modalBody = document.getElementById('modal-body');
  closeBtn = modal.querySelector('.modal-close');
  overlay = modal.querySelector('.modal-overlay');
  
  // Close modal on close button click
  closeBtn.addEventListener('click', closeModal);
  
  // Close modal on overlay click
  overlay.addEventListener('click', closeModal);
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/**
 * Open modal with seller information
 * @param {Object} seller - Seller object
 */
export function openModal(seller) {
  if (!modal || !modalBody) return;
  
  // Generate modal content
  const content = generateModalContent(seller);
  modalBody.innerHTML = content;
  
  // Show modal
  modal.hidden = false;
  
  // Trigger reflow for animation
  modal.offsetHeight;
  
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Focus close button for accessibility
  closeBtn.focus();
  
  // Trap focus within modal
  trapFocus(modal);
}

/**
 * Close modal
 */
export function closeModal() {
  if (!modal) return;
  
  modal.classList.remove('open');
  document.body.style.overflow = '';
  
  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.hidden = true;
    modalBody.innerHTML = '';
  }, 300);
}

/**
 * Generate modal content HTML
 * @param {Object} seller - Seller object
 * @returns {string} HTML string
 */
function generateModalContent(seller) {
  const stars = generateStars(seller.rating);
  const joinedDate = new Date(seller.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
  
  const productTags = seller.products.map(p => 
    `<span class="modal-product-tag">${p}</span>`
  ).join('');
  
  return `
    <div class="modal-seller-header">
      <div class="modal-seller-image">
        <img src="${seller.image}" alt="${seller.name}" width="100" height="100">
      </div>
      <div class="modal-seller-info">
        <h2 id="modal-title">${seller.name}</h2>
        <p class="modal-seller-category">${seller.category}</p>
        <p class="modal-seller-location">📍 ${seller.location}</p>
        <div class="modal-badges">
          ${seller.verified ? '<span class="modal-badge verified">✓ Verified</span>' : ''}
          ${seller.featured ? '<span class="modal-badge featured">⭐ Featured</span>' : ''}
        </div>
      </div>
    </div>
    
    <div class="modal-section">
      <h3>About</h3>
      <p class="modal-description">${seller.description}</p>
    </div>
    
    <div class="modal-section">
      <h3>Products</h3>
      <div class="modal-products">${productTags}</div>
    </div>
    
    <div class="modal-section">
      <h3>Rating & Info</h3>
      <div class="modal-rating">
        <span class="modal-stars">${stars}</span>
        <span class="modal-rating-value">${seller.rating} / 5.0</span>
      </div>
      <p class="modal-joined">Member since ${joinedDate}</p>
    </div>
    
    <div class="modal-contact-buttons">
      <a href="https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}" class="modal-contact-btn whatsapp" target="_blank" rel="noopener">
        💬 WhatsApp
      </a>
      <a href="https://instagram.com/${seller.instagram.replace('@', '')}" class="modal-contact-btn instagram" target="_blank" rel="noopener">
        📷 Instagram
      </a>
      ${seller.snapchat ? `
        <a href="https://snapchat.com/add/${seller.snapchat}" class="modal-contact-btn snapchat" target="_blank" rel="noopener">
          👻 Snapchat
        </a>
      ` : ''}
    </div>
  `;
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value
 * @returns {string} Star HTML
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  let stars = '';
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars += '⭐';
    } else {
      stars += '☆';
    }
  }
  
  return stars;
}

/**
 * Trap focus within modal for accessibility
 * @param {HTMLElement} element - Modal element
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}