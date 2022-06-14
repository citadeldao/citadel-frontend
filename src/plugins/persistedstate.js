import createPersistedState from 'vuex-persistedstate';
import { computed } from 'vue';

export default function initPersistedstate(store) {
  const postfix = computed(() => store.getters['profile/info']?.id);
  createPersistedState({
    key: 'user',
    paths: [
      'crypto.privateWallets',
      'crypto.mnemonic',
      'wallets.wallets',
      'crypto.passwordHash',
      'extensions.extensionsList',
    ],
    storage: {
      getItem: (key) => {
        if (!postfix.value) {
          return false;
        }

        return localStorage.getItem(`${key}_${postfix.value}`);
      },
      setItem: (key, value) => {
        if (!postfix.value) {
          return false;
        }

        return localStorage.setItem(`${key}_${postfix.value}`, value);
      },
      removeItem: (key) => {
        if (!postfix.value) {
          return false;
        }

        return localStorage.removeItem(`${key}_${postfix.value}`);
      },
    },
  })(store);
}
