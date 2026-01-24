const menuBtn = document.querySelector("#menuBtn");
const primaryNav = document.querySelector("#primaryNav");

menuBtn?.addEventListener("click", () => {
  const open = primaryNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "✕" : "☰";
});