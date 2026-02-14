/* =========================================
   ADNOW - MAIN JAVASCRIPT MODULE
   Entry point for all JavaScript functionality
   ========================================= */

import { initNavigation } from './navigation.js';
import { initSellers, loadCategories } from './sellers.js';
import { initModal } from './modal.js';
import { initStorage, getVisitCount, incrementVisitCount } from './storage.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize core functionality
  initNavigation();
  initStorage();
  
  // Initialize page-specific functionality
  const currentPage = getCurrentPage();
  
  if (currentPage === 'home') {
    initHomePage();
  }
  
  // Initialize components available on all pages
  initModal();
  
  // Set footer information
  setFooterInfo();
  
  // Log visit count (for demonstration of localStorage)
  console.log(`Welcome! This is visit #${getVisitCount()}`);
  incrementVisitCount();
});

/**
 * Determine the current page based on URL
 * @returns {string} Page identifier
 */
function getCurrentPage() {
  const path = window.location.pathname;
  
  if (path.includes('about')) {
    return 'about';
  } else if (path.includes('sellers')) {
    return 'sellers';
  } else if (path.includes('form-success')) {
    return 'form-success';
  } else {
    return 'home';
  }
}

/**
 * Initialize home page functionality
 */
async function initHomePage() {
  try {
    // Initialize sellers display
    await initSellers();
    
    // Load categories
    await loadCategories();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize sort functionality
    initSort();
    
  } catch (error) {
    console.error('Error initializing home page:', error);
    displayError('Unable to load sellers. Please refresh the page.');
  }
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  
  if (!searchForm) return;
  
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    
    // Import dynamically to avoid circular dependency
    import('./sellers.js').then(({ filterSellers }) => {
      filterSellers(searchTerm, category);
    });
  });
  
  // Real-time filtering on input
  searchInput.addEventListener('input', debounce(() => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    
    import('./sellers.js').then(({ filterSellers }) => {
      filterSellers(searchTerm, category);
    });
  }, 300));
  
  // Filter on category change
  categoryFilter.addEventListener('change', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    
    import('./sellers.js').then(({ filterSellers }) => {
      filterSellers(searchTerm, category);
    });
  });
}

/**
 * Initialize sort functionality
 */
function initSort() {
  const sortSelect = document.getElementById('sort-select');
  
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    
    import('./sellers.js').then(({ sortSellers }) => {
      sortSellers(sortBy);
    });
  });
}

/**
 * Set footer information (year and last modified date)
 */
function setFooterInfo() {
  const currentYearElement = document.getElementById('current-year');
  const lastModifiedElement = document.getElementById('last-modified');
  
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
  
  if (lastModifiedElement) {
    lastModifiedElement.textContent = document.lastModified;
  }
}

/**
 * Display error message
 * @param {string} message - Error message to display
 */
function displayError(message) {
  const containers = [
    document.getElementById('featured-sellers-grid'),
    document.getElementById('all-sellers-grid')
  ];
  
  containers.forEach(container => {
    if (container) {
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1;">
          <div class="no-results-icon">⚠️</div>
          <h3>Something went wrong</h3>
          <p>${message}</p>
        </div>
      `;
    }
  });
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for use in other modules
export { debounce, displayError };