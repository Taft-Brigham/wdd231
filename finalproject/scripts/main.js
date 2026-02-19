import { initNavigation } from './navigation.js';
import { initSellers, loadCategories } from './sellers.js';
import { initModal } from './modal.js';
import { initStorage, getVisitCount, incrementVisitCount } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStorage();
  initModal();
  setFooterInfo();
  
  const isHomePage = !window.location.pathname.includes('about') && 
                     !window.location.pathname.includes('sellers') &&
                     !window.location.pathname.includes('form-success');
  
  if (isHomePage) {
    initHomePage();
  }
  
  console.log(`Welcome! Visit #${getVisitCount()}`);
  incrementVisitCount();
});

async function initHomePage() {
  try {
    await initSellers();
    await loadCategories();
    initSearch();
    initSort();
  } catch (error) {
    console.error('Error:', error);
  }
}

function initSearch() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const filter = document.getElementById('category-filter');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    doSearch();
  });
  
  input?.addEventListener('input', debounce(doSearch, 300));
  filter?.addEventListener('change', doSearch);
  
  function doSearch() {
    import('./sellers.js').then(({ filterSellers }) => {
      filterSellers(input?.value?.trim().toLowerCase() || '', filter?.value || '');
    });
  }
}

function initSort() {
  const select = document.getElementById('sort-select');
  if (!select) return;
  
  select.addEventListener('change', () => {
    import('./sellers.js').then(({ sortSellers }) => {
      sortSellers(select.value);
    });
  });
}

function setFooterInfo() {
  const year = document.getElementById('current-year');
  const modified = document.getElementById('last-modified');
  
  if (year) year.textContent = new Date().getFullYear();
  if (modified) modified.textContent = document.lastModified;
}

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export { debounce };