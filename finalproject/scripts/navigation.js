export function initNavigation() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-nav');
  
  if (!toggle || !nav) return;
  
  const backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.id = 'nav-backdrop';
  document.body.appendChild(backdrop);
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });
  
  backdrop.addEventListener('click', closeMenu);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-active')) {
      closeMenu();
    }
  });
  
  nav.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) closeMenu();
    });
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) closeMenu();
  });
  
  function toggleMenu() {
    const isOpen = nav.classList.contains('is-active');
    isOpen ? closeMenu() : openMenu();
  }
  
  function openMenu() {
    nav.classList.add('is-active');
    backdrop.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    nav.classList.remove('is-active');
    backdrop.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}