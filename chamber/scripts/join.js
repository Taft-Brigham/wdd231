document.addEventListener("DOMContentLoaded", () => {
  // 1) timestamp
  const ts = document.querySelector("#timestamp");
  if (ts) ts.value = new Date().toISOString();

  // 2) open modals
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dialog = document.querySelector(`#${btn.dataset.modal}`);
      dialog?.showModal();
    });
  });

  // 3) close modals
  document.querySelectorAll("dialog.modal").forEach((dialog) => {
    dialog.querySelector(".modal-close")?.addEventListener("click", () => dialog.close());

    // click outside modal-box closes
    dialog.addEventListener("click", (e) => {
      const box = dialog.querySelector(".modal-box");
      if (box && !box.contains(e.target)) dialog.close();
    });
  });
});