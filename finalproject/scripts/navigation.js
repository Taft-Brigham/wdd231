/* =========================================
   ADNOW - NAVIGATION MODULE
   Handles responsive navigation functionality
   ========================================= */

/**
 * Initialize navigation functionality
 */
export function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.getElementById('main-nav');
  
  if (!navToggle || !mainNav) return;
  
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('nav-overlay');
  document.body.appendChild(overlay);
  
  // Toggle navigation on hamburger click
  navToggle.addEventListener('click', () => {
    toggleNav(navToggle, mainNav, overlay);
  });
  
  // Close navigation on overlay click
  overlay.addEventListener('click', () => {
    closeNav(navToggle, mainNav, overlay);
  });
  
  // Close navigation on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      closeNav(navToggle, mainNav, overlay);
    }
  });
  
  // Close navigation on window resize (if larger than mobile breakpoint)
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768 && mainNav.classList.contains('open')) {
      closeNav(navToggle, mainNav, overlay);
    }
  }, 150));
  
  // Handle nav link clicks (close menu on mobile)
  const navLinks = mainNav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeNav(navToggle, mainNav, overlay);
      }
    });
  });
}

/**
 * Toggle navigation open/closed state
 * @param {HTMLElement} toggle - Navigation toggle button
 * @param {HTMLElement} nav - Navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function toggleNav(toggle, nav, overlay) {
  const isOpen = nav.classList.contains('open');
  
  if (isOpen) {
    closeNav(toggle, nav, overlay);
  } else {
    openNav(toggle, nav, overlay);
  }
}

/**
 * Open navigation
 * @param {HTMLElement} toggle - Navigation toggle button
 * @param {HTMLElement} nav - Navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function openNav(toggle, nav, overlay) {
  nav.classList.add('open');
  overlay.classList.add('show');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  
  // Focus first nav link for accessibility
  const firstLink = nav.querySelector('.nav-link');
  if (firstLink) {
    firstLink.focus();
  }
}

/**
 * Close navigation
 * @param {HTMLElement} toggle - Navigation toggle button
 * @param {HTMLElement} nav - Navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function closeNav(toggle, nav, overlay) {
  nav.classList.remove('open');
  overlay.classList.remove('show');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  
  // Return focus to toggle button
  toggle.focus();
}

/**
 * Simple debounce function
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