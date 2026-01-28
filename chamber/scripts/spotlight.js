const spotlightGrid = document.querySelector("#spotlightGrid");

function levelLabel(level) {
  if (level === 3) return "Gold";
  if (level === 2) return "Silver";
  return "Member";
}

function shuffle(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function spotlightCount() {
  return window.matchMedia("(min-width: 800px)").matches ? 3 : 2;
}

function renderSpotlights(members) {
  spotlightGrid.innerHTML = "";

  const eligible = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
  const chosen = shuffle(eligible).slice(0, spotlightCount());

  chosen.forEach(m => {
    const card = document.createElement("article");
    card.className = "spotlight-card";

    card.innerHTML = `
      <div class="spotlight-head">
        <h2>${m.name}</h2>
        <p>${levelLabel(m.membershipLevel)} Member</p>
      </div>

      <div class="spotlight-body">
        <img src="images/${m.image}" alt="${m.name} logo" loading="lazy" width="90" height="90">
        <div>
          <p><strong>Phone:</strong> ${m.phone}</p>
          <p><strong>Address:</strong> ${m.address}</p>
          <p><strong>Website:</strong> <a href="${m.website}" target="_blank" rel="noopener">${m.website}</a></p>
        </div>
      </div>
    `;

    spotlightGrid.appendChild(card);
  });
}

async function loadSpotlights() {
  try {
    const res = await fetch("data/members.json");
    if (!res.ok) throw Error(await res.text());
    const data = await res.json();

    // your JSON might be { "companies": [...] } or { "members": [...] }
    const members = data.companies ?? data.members ?? [];
    renderSpotlights(members);

    // re-render if user rotates/resizes (optional but helpful)
    window.addEventListener("resize", () => renderSpotlights(members), { passive: true });
  } catch (err) {
    console.error(err);
    spotlightGrid.innerHTML = "<p>Spotlights unavailable.</p>";
  }
}

loadSpotlights();