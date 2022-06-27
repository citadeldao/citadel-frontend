import router from '@/router';

/**
 * redirectToWallet
 * Redirect to wallet/token and matching tab (assets -> stake -> send)
 * @param wallet {Object} - wallet instance
 * @param token {Object} - token instance if needed
 * @param root {Boolean} - using /wallet/ tab matching
 */

export default ({ wallet, token, root = false }) => {
  const currentRoute = router.currentRoute.value;
  const hasContext = currentRoute.name !== 'Wallet';

  if (!wallet) {
    router.push({ name: 'AddAddress' });
  }

  const context = token || wallet;
  const routeName =
    (root && hasContext) || !hasContext
      ? context.hasSubtoken
        ? 'WalletAssets'
        : context.hasStake
        ? 'WalletStake'
        : 'WalletAssets'
      : currentRoute.name;

  router.push({
    name: routeName,
    params: {
      net: wallet?.net,
      address: wallet?.address,
      token: token?.net,
    },
  });
};
