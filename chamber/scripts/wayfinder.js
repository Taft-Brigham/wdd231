document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("#primaryNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  if (!links.length) return;

  let currentPage = window.location.pathname.split("/").pop();

  
  if (currentPage === "") currentPage = "index.html";

  links.forEach((link) => {
    const linkPage = new URL(link.href, window.location.href).pathname.split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
});