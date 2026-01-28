document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("#primaryNav");
  if (!nav) return;

  const links = nav.querySelectorAll("a");
  if (!links.length) return;

  // get current filename (e.g., "directory.html")
  let currentPage = window.location.pathname.split("/").pop();

  // if URL ends with "/" treat as index.html
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