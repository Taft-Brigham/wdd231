import { interests } from "../data/accra-interests.mjs";

const grid = document.querySelector("#discoverGrid");


const areaClasses = ["area-a","area-b","area-c","area-d","area-e","area-f","area-g","area-h"];

function buildCards() {
  grid.innerHTML = "";

  interests.forEach((item, i) => {
    const card = document.createElement("article");
    card.className = `discover-card ${areaClasses[i] ?? ""}`;

    card.innerHTML = `
      <h2>${item.title}</h2>
      <figure>
        <img
          src="images/${item.image}"
          alt="${item.alt}"
          width="300"
          height="200"
          loading="lazy">
      </figure>
      <address>${item.address}</address>
      <p>${item.description}</p>
      <button type="button" class="learn-more">Learn more</button>
    `;

    grid.appendChild(card);
  });
}

buildCards();


const visitText = document.querySelector("#visitText");
const closeVisit = document.querySelector("#closeVisit");
const visitBox = document.querySelector(".visit-message");

const KEY = "accraChamberDiscoverLastVisit";
const now = Date.now();
const last = Number(localStorage.getItem(KEY));

function daysBetween(msNow, msThen) {
  const diff = msNow - msThen;
  return Math.floor(diff / 86400000); 
}

let message = "";

if (!last) {
  message = "Welcome! Let us know if you have any questions.";
} else {
  const days = daysBetween(now, last);

  if (days < 1) {
    message = "Back so soon! Awesome!";
  } else if (days === 1) {
    message = "You last visited 1 day ago.";
  } else {
    message = `You last visited ${days} days ago.`;
  }
}

visitText.textContent = message;
localStorage.setItem(KEY, String(now));

closeVisit.addEventListener("click", () => {
  visitBox.style.display = "none";
});