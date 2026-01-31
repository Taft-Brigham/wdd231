document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const first = params.get("first") ?? "";
  const last = params.get("last") ?? "";
  const email = params.get("email") ?? "";
  const phone = params.get("phone") ?? "";
  const business = params.get("business") ?? "";
  const timestamp = params.get("timestamp") ?? "";

  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  setText("#ty-first", first);
  setText("#ty-last", last);
  setText("#ty-email", email);
  setText("#ty-phone", phone);
  setText("#ty-business", business);

  // Format ISO timestamp nicely if valid
  const d = new Date(timestamp);
  const tsOut = Number.isNaN(d.getTime()) ? timestamp : d.toLocaleString();
  setText("#ty-timestamp", tsOut);
});