import { createRouter, createWebHistory } from 'vue-router';
import guards from './guards';
import routes from './routes';
import store from '@/store';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from) {
    const scrollableLayout = document.getElementById('main');

    if (
      scrollableLayout &&
      to.name !== 'WalletAssets' &&
      from.name !== 'WalletAssets'
    ) {
      scrollableLayout.scrollTop = 0;
    }
  },
});

router.beforeEach(guards);
router.afterEach(() => {
  store.dispatch('app/setRouteLoader', false);
});

export default router;
