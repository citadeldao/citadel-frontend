export const setStorage = (key, data) => {
  window.localStorage.setItem(key, data);
};

export const getStorage = (key) =>
  window.localStorage.getItem(key);

export const removeStorage = (key) => {
  window.localStorage.removeItem(key);
};

// TYPES OF LS KEYS
export const types = {
  IS_AUTHENTICATED: 'isAuthenticated',
};
