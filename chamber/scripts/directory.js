const membersEl = document.querySelector("#members");
const gridBtn = document.querySelector("#gridBtn");
const listBtn = document.querySelector("#listBtn");

function levelLabel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  return "Member";
}

function renderMembers(companies) {
  membersEl.innerHTML = "";

  companies.forEach((c) => {
    const card = document.createElement("article");
    card.className = "member-card";

    const img = document.createElement("img");
    img.src = `images/${c.image}`;
    img.alt = `${c.name} logo`;
    img.loading = "lazy";
    img.width = 260;
    img.height = 140;

    const name = document.createElement("h2");
    name.className = "member-name";
    name.textContent = c.name;

    const address = document.createElement("p");
    address.className = "member-address";
    address.textContent = c.address;

    const phone = document.createElement("p");
    phone.className = "member-phone";
    phone.textContent = c.phone;

    const link = document.createElement("a");
    link.className = "member-link";
    link.href = c.website;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = c.website;

    card.append(img, name, address, phone, link);
    membersEl.appendChild(card);
  });
}

async function loadMembers() {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    renderMembers(data.companies);
  } catch (err) {
    console.error("Failed to load members:", err);
    membersEl.innerHTML = `<p>Sorry, member data could not be loaded.</p>`;
  }
}

function setView(view) {
  membersEl.classList.toggle("grid", view === "grid");
  membersEl.classList.toggle("list", view === "list");

  gridBtn.classList.toggle("active", view === "grid");
  listBtn.classList.toggle("active", view === "list");
}

gridBtn.addEventListener("click", () => setView("grid"));
listBtn.addEventListener("click", () => setView("list"));

setView("grid");
loadMembers();