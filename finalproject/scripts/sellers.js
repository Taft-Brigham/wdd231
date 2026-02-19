import { openModal } from './modal.js';

let allSellers = [];
let filteredSellers = [];

export async function initSellers() {
  try {
    const response = await fetch('./data/sellers.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    allSellers = data.sellers;
    filteredSellers = [...allSellers];
    
    displaySellers(allSellers.filter(s => s.featured), 'featured-sellers-grid');
    displaySellers(allSellers, 'all-sellers-grid');
  } catch (error) {
    console.error('Failed to load sellers:', error);
    throw error;
  }
}

export async function loadCategories() {
  try {
    const response = await fetch('./data/sellers.json');
    const data = await response.json();
    
    const filter = document.getElementById('category-filter');
    if (filter) {
      data.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        filter.appendChild(option);
      });
    }
    
    const grid = document.getElementById('categories-grid');
    if (grid) {
      grid.innerHTML = data.categories.map(cat => `
        <div class="category-item" data-category="${cat.name}" tabindex="0" role="button">
          <span class="category-icon">${cat.icon}</span>
          <span class="category-label">${cat.name}</span>
          <span class="category-count">${cat.count} sellers</span>
        </div>
      `).join('');
      
      grid.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => selectCategory(item.dataset.category));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectCategory(item.dataset.category);
          }
        });
      });
    }
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
}

function selectCategory(category) {
  const filter = document.getElementById('category-filter');
  const input = document.getElementById('search-input');
  
  if (filter) filter.value = category;
  if (input) input.value = '';
  
  filterSellers('', category);
  document.querySelector('.directory-section')?.scrollIntoView({ behavior: 'smooth' });
}

function displaySellers(sellers, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  if (!sellers.length) {
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>No sellers found</h3>
        <p>Try adjusting your search criteria.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = sellers.map(seller => `
    <article class="seller-card" data-id="${seller.id}" tabindex="0">
      <div class="seller-card-img">
        <img src="${seller.image}" alt="${seller.name}" loading="lazy" width="400" height="300">
        ${seller.featured ? '<span class="badge-featured">Featured</span>' : ''}
        ${seller.verified ? '<span class="badge-verified">✓</span>' : ''}
      </div>
      <div class="seller-card-body">
        <h3 class="seller-card-name">${seller.name}</h3>
        <p class="seller-card-category">${seller.category}</p>
        <p class="seller-card-location">📍 ${seller.location}</p>
        <div class="seller-card-rating">
          <span class="rating-stars">${'⭐'.repeat(Math.floor(seller.rating))}</span>
          <span class="rating-value">${seller.rating}</span>
        </div>
        <div class="seller-card-tags">
          ${seller.products.slice(0, 3).map(p => `<span class="tag">${p}</span>`).join('')}
        </div>
        <div class="seller-card-actions">
          <a href="https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}" class="contact-link whatsapp" target="_blank" rel="noopener">💬 WhatsApp</a>
          <a href="https://instagram.com/${seller.instagram.replace('@', '')}" class="contact-link instagram" target="_blank" rel="noopener">📷 Instagram</a>
        </div>
      </div>
    </article>
  `).join('');
  
  container.querySelectorAll('.seller-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.seller-card-actions')) {
        const seller = allSellers.find(s => s.id === parseInt(card.dataset.id));
        if (seller) openModal(seller);
      }
    });
  });
}

export function filterSellers(term = '', category = '') {
  filteredSellers = allSellers.filter(s => {
    const matchTerm = s.name.toLowerCase().includes(term) ||
                      s.description.toLowerCase().includes(term) ||
                      s.products.some(p => p.toLowerCase().includes(term)) ||
                      s.location.toLowerCase().includes(term);
    const matchCat = !category || s.category === category;
    return matchTerm && matchCat;
  });
  
  displaySellers(filteredSellers, 'all-sellers-grid');
}

export function sortSellers(by) {
  const sorted = [...filteredSellers];
  
  if (by === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (by === 'rating') sorted.sort((a, b) => b.rating - a.rating);
  else if (by === 'newest') sorted.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
  
  displaySellers(sorted, 'all-sellers-grid');
}

export { allSellers };