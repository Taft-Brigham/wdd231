/* =========================================
   ADNOW - LOCAL STORAGE MODULE
   Handles localStorage operations
   ========================================= */

const STORAGE_KEYS = {
  VISIT_COUNT: 'adnow_visit_count',
  FAVORITES: 'adnow_favorites',
  SEARCH_HISTORY: 'adnow_search_history',
  USER_PREFERENCES: 'adnow_preferences',
  LAST_VISIT: 'adnow_last_visit'
};

/**
 * Initialize storage and track visits
 */
export function initStorage() {
  // Record visit timestamp
  const now = new Date().toISOString();
  localStorage.setItem(STORAGE_KEYS.LAST_VISIT, now);
  
  // Initialize favorites if not exists
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  }
  
  // Initialize search history if not exists
  if (!localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)) {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
  }
  
  // Initialize preferences if not exists
  if (!localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)) {
    const defaultPreferences = {
      sortBy: 'name',
      viewMode: 'grid',
      darkMode: false
    };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(defaultPreferences));
  }
}

/**
 * Get visit count
 * @returns {number} Number of visits
 */
export function getVisitCount() {
  const count = localStorage.getItem(STORAGE_KEYS.VISIT_COUNT);
  return count ? parseInt(count) : 0;
}

/**
 * Increment visit count
 */
export function incrementVisitCount() {
  const currentCount = getVisitCount();
  localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, (currentCount + 1).toString());
}

/**
 * Save seller to favorites
 * @param {number} sellerId - Seller ID
 */
export function saveFavoriteSeller(sellerId) {
  const favorites = getFavoriteSellers();
  
  if (!favorites.includes(sellerId)) {
    favorites.push(sellerId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
}

/**
 * Remove seller from favorites
 * @param {number} sellerId - Seller ID
 */
export function removeFavoriteSeller(sellerId) {
  const favorites = getFavoriteSellers();
  const index = favorites.indexOf(sellerId);
  
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
}

/**
 * Get all favorite sellers
 * @returns {Array} Array of seller IDs
 */
export function getFavoriteSellers() {
  const favorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Check if seller is in favorites
 * @param {number} sellerId - Seller ID
 * @returns {boolean} True if seller is favorite
 */
export function isFavoriteSeller(sellerId) {
  const favorites = getFavoriteSellers();
  return favorites.includes(sellerId);
}

/**
 * Save search term to history
 * @param {string} searchTerm - Search term
 */
export function saveSearchHistory(searchTerm) {
  if (!searchTerm.trim()) return;
  
  let history = getSearchHistory();
  
  // Remove duplicate if exists
  history = history.filter(term => term.toLowerCase() !== searchTerm.toLowerCase());
  
  // Add to beginning of array
  history.unshift(searchTerm.trim());
  
  // Keep only last 10 searches
  history = history.slice(0, 10);
  
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
}

/**
 * Get search history
 * @returns {Array} Array of search terms
 */
export function getSearchHistory() {
  const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
  return history ? JSON.parse(history) : [];
}

/**
 * Clear search history
 */
export function clearSearchHistory() {
  localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify([]));
}

/**
 * Get user preferences
 * @returns {Object} User preferences
 */
export function getUserPreferences() {
  const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  return preferences ? JSON.parse(preferences) : {};
}

/**
 * Update user preferences
 * @param {Object} newPreferences - New preferences to merge
 */
export function updateUserPreferences(newPreferences) {
  const currentPreferences = getUserPreferences();
  const updatedPreferences = { ...currentPreferences, ...newPreferences };
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPreferences));
}

/**
 * Get last visit date
 * @returns {string|null} Last visit ISO string
 */
export function getLastVisit() {
  return localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
}

/**
 * Clear all storage data
 */
export function clearAllStorage() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}