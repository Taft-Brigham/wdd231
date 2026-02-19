const KEYS = {
  VISITS: 'adnow_visits',
  FAVORITES: 'adnow_favorites',
  PREFS: 'adnow_prefs'
};

export function initStorage() {
  localStorage.setItem('adnow_last_visit', new Date().toISOString());
  
  if (!localStorage.getItem(KEYS.FAVORITES)) {
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify([]));
  }
}

export function getVisitCount() {
  return parseInt(localStorage.getItem(KEYS.VISITS) || '0');
}

export function incrementVisitCount() {
  localStorage.setItem(KEYS.VISITS, (getVisitCount() + 1).toString());
}

export function saveFavorite(id) {
  const favs = getFavorites();
  if (!favs.includes(id)) {
    favs.push(id);
    localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
  }
}

export function removeFavorite(id) {
  const favs = getFavorites().filter(f => f !== id);
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favs));
}

export function getFavorites() {
  return JSON.parse(localStorage.getItem(KEYS.FAVORITES) || '[]');
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}