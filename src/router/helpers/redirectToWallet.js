import router from '@/router';

/**
 * redirectToWallet
 * Redirect to wallet/token and matching tab (assets -> stake -> send)
 * @param wallet {Object} - wallet instance
 * @param token {Object} - token instance if needed
 * @param root {Boolean} - using /wallet/ tab matching
 */

export default async ({ wallet, token, root = false }) => {
  const currentRoute = router.currentRoute.value;
  const hasContext = currentRoute.name !== 'Wallet';

  if (!wallet) {
    await router.push({ name: 'AddAddress' });
  }
  console.warn('testtest');

  const routeName =
    (root && hasContext) || !hasContext ? 'WalletAssets' : currentRoute.name;
  await router.push({
    name: routeName,
    params: {
      net: wallet?.net,
      address: wallet?.address,
      token: token?.net,
    },
  });
};
