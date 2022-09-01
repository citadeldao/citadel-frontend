export default [
  {
    path: '/',
    name: 'HomePage',
    component: () =>
      import(/* webpackChunkName: 'HomePage' */ '@/views/HomePage'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: 'Login' */ '@/views/Login'),
    meta: {
      layout: 'DefaultLayout',
      guard: 'guest',
    },
  },
  {
    path: '/wallet/:net?/:token?/:address?',
    name: 'Wallet',
    // redirect: to => ({ name: 'WalletSend', params: { ...to.params } }),
    component: () => import(/* webpackChunkName: 'Wallet' */ '@/views/Wallet'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
    children: [
      {
        name: 'WalletAssets',
        path: 'assets',
        component: () =>
          import(
            /* webpackChunkName: 'Assets' */ '@/views/Wallet/views/Assets'
          ),
      },
      {
        name: 'WalletStake',
        path: 'stake',
        component: () =>
          import(/* webpackChunkName: 'Stake' */ '@/views/Wallet/views/Stake'),
      },
      {
        name: 'WalletRewards',
        path: 'rewards',
        component: () =>
          import(
            /* webpackChunkName: 'WalletRewards' */ '@/views/Wallet/views/WalletRewards'
          ),
      },
      {
        name: 'WalletSend',
        path: 'send',
        component: () =>
          import(/* webpackChunkName: 'Send' */ '@/views/Wallet/views/Send'),
      },
      {
        name: 'WalletTransactions',
        path: 'transactions',
        component: () =>
          import(
            /* webpackChunkName: 'Transactions' */ '@/views/Wallet/views/Transactions'
          ),
      },
    ],
  },
  {
    path: '/add-address',
    name: 'AddAddress',
    component: () =>
      import(/* webpackChunkName: 'AddAddress' */ '@/views/AddAddressV2'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
      title: 'addAnAddress',
    },
  },
  {
    path: '/add-address/wallet-types',
    name: 'AddWalletTypes',
    component: () =>
      import(/* webpackChunkName: 'AddAddress' */ '@/views/AddAddressV2Types'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
      title: 'addAnAddress',
    },
  },
  // {
  // path: '/add-address',
  // name: 'AddAddress',
  // component: () => import(/* webpackChunkName: 'AddAddress' */ '@/views/AddAddress'),
  // meta: {
  // layout: 'AddAddressLayout',
  // guard: 'private',
  // title: 'addAnAddress',
  // },
  // },
  {
    path: '/add-address/add-to-one-seed',
    name: 'AddToOneSeed',
    component: () =>
      import(/* webpackChunkName: 'AddToOneSeed' */ '@/views/AddToOneSeed'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/add-to-public-key',
    name: 'AddToPublicKey',
    component: () =>
      import(/* webpackChunkName: 'AddToPublicKey' */ '@/views/AddToPublicKey'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address',
    name: 'ImportExistingAddress',
    component: () =>
      import(
        /* webpackChunkName: 'ImportExistingAddress' */ '@/views/ImportExistingAddress'
      ),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/import-private-key',
    name: 'ImportPrivateKey',
    component: () =>
      import(
        /* webpackChunkName: 'ImportPrivateKey' */ '@/views/ImportPrivateKey'
      ),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/import-seed-phrase',
    name: 'ImportSeedPhrase',
    component: () =>
      import(
        /* webpackChunkName: 'ImportSeedPhrase' */ '@/views/ImportSeedPhrase'
      ),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/import-file',
    name: 'ImportFile',
    component: () =>
      import(/* webpackChunkName: 'ImportFile' */ '@/views/ImportFile'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/restore-one-seed',
    name: 'RestoreOneSeed',
    component: () =>
      import(/* webpackChunkName: 'RestoreOneSeed' */ '@/views/RestoreOneSeed'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/metamask-keplr',
    name: 'MetamaskKeplr',
    component: () =>
      import(/* webpackChunkName: 'MetamaskKeplr' */ '@/views/MetamaskKeplr'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/metamask',
    name: 'Metamask',
    component: () =>
      import(/* webpackChunkName: 'Metamask' */ '@/views/Metamask'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-existing-address/keplr',
    name: 'Keplr',
    component: () => import(/* webpackChunkName: 'Keplr' */ '@/views/Keplr'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-hardware-wallet',
    name: 'ImportHardwareWallet',
    component: () =>
      import(
        /* webpackChunkName: 'ImportHardwareWallet' */ '@/views/ImportHardwareWallet'
      ),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-hardware-wallet/import-ledger',
    name: 'ImportLedger',
    component: () =>
      import(/* webpackChunkName: 'ImportLedger' */ '@/views/ImportLedger'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/add-address/import-hardware-wallet/import-trezor',
    name: 'ImportTrezor',
    component: () =>
      import(/* webpackChunkName: 'ImportTrezor' */ '@/views/ImportTrezor'),
    meta: {
      layout: 'AddressFlowLayout',
      guard: 'private',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () =>
      import(/* webpackChunkName: 'Settings' */ '@/views/Settings'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
      title: 'settingsTitle',
    },
  },
  {
    path: '/extensions/:name?',
    name: 'Extensions',
    component: () =>
      import(/* webpackChunkName: 'Extensions' */ '@/views/Extensions'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
  },
  {
    path: '/dao',
    name: 'Dao',
    component: () => import(/* webpackChunkName: 'Dao' */ '@/views/Dao'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
      title: 'daoTitle',
    },
  },
  {
    path: '/rewards',
    name: 'Rewards',
    component: () =>
      import(/* webpackChunkName: 'Rewards' */ '@/views/Rewards'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
      title: 'rewards',
    },
  },
  {
    path: '/overall',
    name: 'Overall',
    component: () => import('@/views/Overall'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
      title: 'overallTitle',
    },
  },
  {
    path: '/error-404',
    name: 'ErrorPage',
    component: () =>
      import(/* webpackChunkName: 'ErrorPage' */ '@/views/ErrorPage'),
    meta: {
      layout: 'DefaultLayout',
      guard: 'private',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: { name: 'ErrorPage' },
  },
  {
    path: '/multisig-balance',
    name: 'multisigBalance',
    component: () => import('@/views/MultisigBalance'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
  },
  {
    path: '/multisig',
    name: 'multisigSend',
    component: () => import('@/views/MultisigSend'),
    meta: {
      layout: 'AddAddressLayout',
      guard: 'private',
    },
  },
];
