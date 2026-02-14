/* =========================================
   ADNOW - SELLERS MODULE
   Handles fetching and displaying seller data
   ========================================= */

import { openModal } from './modal.js';
import { saveFavoriteSeller, isFavoriteSeller } from './storage.js';

// Store sellers data globally for filtering and sorting
let allSellers = [];
let currentFilteredSellers = [];

/**
 * Initialize sellers functionality
 */
export async function initSellers() {
  try {
    const data = await fetchSellersData();
    allSellers = data.sellers;
    currentFilteredSellers = [...allSellers];
    
    // Display featured sellers
    const featuredSellers = allSellers.filter(seller => seller.featured);
    displaySellers(featuredSellers, 'featured-sellers-grid');
    
    // Display all sellers
    displaySellers(allSellers, 'all-sellers-grid');
    
  } catch (error) {
    console.error('Error initializing sellers:', error);
    throw error;
  }
}

/**
 * Fetch sellers data from JSON file
 * @returns {Promise<Object>} Sellers data
 */
async function fetchSellersData() {
  try {
    const response = await fetch('./data/sellers.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error fetching sellers data:', error);
    throw error;
  }
}

/**
 * Load and display categories
 */
export async function loadCategories() {
  try {
    const data = await fetchSellersData();
    const categories = data.categories;
    
    // Populate category filter dropdown
    populateCategoryFilter(categories);
    
    // Display category cards
    displayCategories(categories);
    
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

/**
 * Populate category filter dropdown
 * @param {Array} categories - Array of category objects
 */
function populateCategoryFilter(categories) {
  const categoryFilter = document.getElementById('category-filter');
  
  if (!categoryFilter) return;
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
}

/**
 * Display categories in grid
 * @param {Array} categories - Array of category objects
 */
function displayCategories(categories) {
  const container = document.getElementById('categories-grid');
  
  if (!container) return;
  
  const html = categories.map(category => `
    <div class="category-card" data-category="${category.name}" tabindex="0" role="button" aria-label="Browse ${category.name} sellers">
      <span class="category-icon">${category.icon}</span>
      <span class="category-name">${category.name}</span>
      <span class="category-count">${category.count} sellers</span>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // Add click handlers to category cards
  container.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      filterByCategory(category);
    });
    
    // Handle keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const category = card.dataset.category;
        filterByCategory(category);
      }
    });
  });
}

/**
 * Filter sellers by category (from category cards)
 * @param {string} category - Category to filter by
 */
function filterByCategory(category) {
  const categoryFilter = document.getElementById('category-filter');
  const searchInput = document.getElementById('search-input');
  
  if (categoryFilter) {
    categoryFilter.value = category;
  }
  
  if (searchInput) {
    searchInput.value = '';
  }
  
  filterSellers('', category);
  
  // Scroll to all sellers section
  const allSellersSection = document.querySelector('.all-sellers');
  if (allSellersSection) {
    allSellersSection.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Display sellers in specified container
 * @param {Array} sellers - Array of seller objects
 * @param {string} containerId - ID of container element
 */
function displaySellers(sellers, containerId) {
  const container = document.getElementById(containerId);
  
  if (!container) return;
  
  if (sellers.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <div class="no-results-icon">🔍</div>
        <h3>No sellers found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    `;
    return;
  }
  
  const html = sellers.map(seller => createSellerCard(seller)).join('');
  container.innerHTML = html;
  
  // Add click handlers to seller cards
  container.querySelectorAll('.seller-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on contact buttons
      if (!e.target.closest('.seller-card-contact')) {
        const sellerId = parseInt(card.dataset.sellerId);
        const seller = allSellers.find(s => s.id === sellerId);
        if (seller) {
          openModal(seller);
        }
      }
    });
  });
}

/**
 * Create HTML for seller card
 * @param {Object} seller - Seller object
 * @returns {string} HTML string
 */
function createSellerCard(seller) {
  const stars = generateStars(seller.rating);
  const productTags = seller.products.slice(0, 3).map(p => 
    `<span class="product-tag">${p}</span>`
  ).join('');
  
  return `
    <article class="seller-card" data-seller-id="${seller.id}" tabindex="0" role="button" aria-label="View ${seller.name} profile">
      <div class="seller-card-image">
        <img 
          src="${seller.image}" 
          alt="${seller.name} products" 
          loading="lazy"
          width="400"
          height="300"
        >
        ${seller.featured ? '<span class="featured-badge">Featured</span>' : ''}
        ${seller.verified ? '<span class="verified-badge" title="Verified Seller">✓</span>' : ''}
      </div>
      <div class="seller-card-content">
        <h3 class="seller-card-name">${seller.name}</h3>
        <p class="seller-card-category">${seller.category}</p>
        <p class="seller-card-location">📍 ${seller.location}</p>
        <div class="seller-card-rating">
          <span class="rating-stars">${stars}</span>
          <span class="rating-value">${seller.rating}</span>
        </div>
        <div class="seller-card-products">${productTags}</div>
        <div class="seller-card-contact">
          <a href="https://wa.me/${seller.whatsapp.replace(/[^0-9]/g, '')}" class="contact-btn whatsapp" target="_blank" rel="noopener" aria-label="Contact on WhatsApp">
            💬 WhatsApp
          </a>
          <a href="https://instagram.com/${seller.instagram.replace('@', '')}" class="contact-btn instagram" target="_blank" rel="noopener" aria-label="View on Instagram">
            📷 Instagram
          </a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Generate star rating HTML
 * @param {number} rating - Rating value
 * @returns {string} Star HTML
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '⭐';
  }
  
  if (hasHalfStar && fullStars < 5) {
    stars += '✨';
  }
  
  return stars;
}

/**
 * Filter sellers based on search term and category
 * @param {string} searchTerm - Search term
 * @param {string} category - Category filter
 */
export function filterSellers(searchTerm = '', category = '') {
  currentFilteredSellers = allSellers.filter(seller => {
    const matchesSearch = 
      seller.name.toLowerCase().includes(searchTerm) ||
      seller.description.toLowerCase().includes(searchTerm) ||
      seller.products.some(p => p.toLowerCase().includes(searchTerm)) ||
      seller.location.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !category || seller.category === category;
    
    return matchesSearch && matchesCategory;
  });
  
  displaySellers(currentFilteredSellers, 'all-sellers-grid');
}

/**
 * Sort sellers based on criteria
 * @param {string} sortBy - Sort criteria
 */
export function sortSellers(sortBy) {
  const sortedSellers = [...currentFilteredSellers];
  
  switch (sortBy) {
    case 'name':
      sortedSellers.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      sortedSellers.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sortedSellers.sort((a, b) => new Date(b.joinedDate) - new Date(a.joinedDate));
      break;
    default:
      break;
  }
  
  displaySellers(sortedSellers, 'all-sellers-grid');
}

// Export for modal use
export { allSellers };