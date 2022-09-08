import { getStorage, types } from '@/utils/storage';
import store from '@/store';

/* eslint-disable-next-line consistent-return */
export default async (to, from, next) => {
  const isAuthenticated = getStorage(types.IS_AUTHENTICATED) === 'true';
  if (to.hash) {
    localStorage.setItem('hashInfo', to.hash);
  }

  if (from.meta.guard !== to.meta.guard) {
    store.dispatch('app/setRouteLoader', true);
  }

  if (to.meta.guard === 'private' && !isAuthenticated) {
    return next({ name: 'Login' });
  }

  if (
    to.meta.guard === 'guest' &&
    isAuthenticated &&
    !store.getters['wallets/wallets'].length
  ) {
    return next({ name: 'AddAddress' });
  }

  next();
};
