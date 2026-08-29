/**
 * User-Scoped Storage Utility
 * Ensures complete multi-tenancy and data isolation across accounts.
 */

// Extract unique identifier from user object
export const getUserId = (user) => {
  if (!user) return "guest_user";
  return user._id || user.id || (user.email ? user.email.toLowerCase().trim() : "guest_user");
};

// Storage Key Generators
export const getUserHistoryKey = (userId) => `generation_history_${userId}`;
export const getUserFavoritesKey = (userId) => `favorites_${userId}`;
export const getUserGalleryKey = (userId) => `user_gallery_${userId}`;
export const getUserSettingsKey = (userId) => `user_settings_${userId}`;

// ==========================================
// USER GENERATION HISTORY
// ==========================================

export const getUserHistory = (user) => {
  try {
    const uid = getUserId(user);
    const key = getUserHistoryKey(uid);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }

    // If first time for this user, check if legacy unnamespaced history exists and user matches
    const legacy = localStorage.getItem("generation_history");
    if (legacy && uid !== "guest_user") {
      const parsedLegacy = JSON.parse(legacy);
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        // Migrate to user key
        localStorage.setItem(key, JSON.stringify(parsedLegacy));
        return parsedLegacy;
      }
    }

    return [];
  } catch (e) {
    console.warn("Error reading user history:", e);
    return [];
  }
};

export const setUserHistory = (user, history) => {
  try {
    const uid = getUserId(user);
    const key = getUserHistoryKey(uid);
    const items = Array.isArray(history) ? history.slice(0, 100) : [];
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving user history:", e);
  }
};

export const clearUserHistory = (user) => {
  try {
    const uid = getUserId(user);
    localStorage.removeItem(getUserHistoryKey(uid));
  } catch (e) {
    console.warn("Error clearing user history:", e);
  }
};

// ==========================================
// USER FAVORITES
// ==========================================

export const getUserFavorites = (user) => {
  try {
    const uid = getUserId(user);
    const key = getUserFavoritesKey(uid);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    console.warn("Error reading user favorites:", e);
    return [];
  }
};

export const setUserFavorites = (user, favorites) => {
  try {
    const uid = getUserId(user);
    const key = getUserFavoritesKey(uid);
    const items = Array.isArray(favorites) ? favorites : [];
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving user favorites:", e);
  }
};

// ==========================================
// USER GALLERY / POSTS
// ==========================================

export const getUserGallery = (user) => {
  try {
    const uid = getUserId(user);
    const key = getUserGalleryKey(uid);
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    console.warn("Error reading user gallery:", e);
    return [];
  }
};

export const setUserGallery = (user, gallery) => {
  try {
    const uid = getUserId(user);
    const key = getUserGalleryKey(uid);
    const items = Array.isArray(gallery) ? gallery : [];
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn("Error saving user gallery:", e);
  }
};
