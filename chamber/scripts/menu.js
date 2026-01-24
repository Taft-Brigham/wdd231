document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener("click", () => {
    const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
    hamburger.setAttribute("aria-expanded", String(!isExpanded));
    navMenu.classList.toggle("active");
    hamburger.textContent = isExpanded ? "☰" : "✕";
  });

  
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.textContent = "☰";
    });
  });

  
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 800) {
      navMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.textContent = "☰";
    }
  });
});