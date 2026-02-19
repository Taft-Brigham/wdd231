let modal = null;
let content = null;
let closeBtn = null;

export function initModal() {
  modal = document.getElementById('seller-modal');
  content = document.getElementById('modal-content');
  closeBtn = modal?.querySelector('.modal-dismiss');
  
  if (!modal) return;
  
  closeBtn?.addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
}

export function openModal(seller) {
  if (!modal || !content) return;
  
  const heading = document.getElementById('modal-heading');
  if (heading) {
    heading.textContent = seller.name;
    heading.classList.remove('sr-only');
  }
  
  const joined = new Date(seller.joinedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
  
  content.innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">
        <img src="${seller.image}" alt="${seller.name}" width="100" height="100">
      </div>
      <div class="modal-info">
        <h2>${seller.name}</h2>
        <p class="modal-category">${seller.category}</p>
        <p class="modal-location">📍 ${seller.location}</p>
        <div class="modal-badges">
          ${seller.verified ? '<span class="modal-badge modal-badge-verified">✓ Verified</span>' : ''}
          ${seller.featured ? '<span class="modal-badge modal-badge-featured">⭐ Featured</span>' : ''}
        </div>
      </div>
    </div>
    
    <div class="modal-block">
      <h3>About</h3>
      <p class="modal-description">${seller.description}</p>
    </div>
    
    <div class="modal-block">
      <h3>Products</h3>
      <div class="modal-products">
        ${seller.products.map(p => `<span class="modal-tag">${p}</span>`).join('')}
      </div>
    </div>
    
    <div class="modal-block">
      <h3>Rating</h3>
      <div class="modal-rating">
        <span class="modal-stars">${'⭐'.repeat(Math.floor(seller.rating))}</span>
        <span class="modal-rating-value">${seller.rating} / 5.0</span>
      </div>
      <p class="modal-joined">Member since ${joined}</p>
    </div>
    
    <div class="modal-actions">
      <a href="https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}" class="modal-action modal-action-whatsapp" target="_blank" rel="noopener">💬 WhatsApp</a>
      <a href="https://instagram.com/${seller.instagram.replace('@', '')}" class="modal-action modal-action-instagram" target="_blank" rel="noopener">📷 Instagram</a>
      ${seller.snapchat ? `<a href="https://snapchat.com/add/${seller.snapchat}" class="modal-action modal-action-snapchat" target="_blank" rel="noopener">👻 Snapchat</a>` : ''}
    </div>
  `;
  
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeBtn?.focus();
}

export function closeModal() {
  if (!modal) return;
  
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  
  const heading = document.getElementById('modal-heading');
  if (heading) {
    heading.textContent = 'Seller Details';
    heading.classList.add('sr-only');
  }
}