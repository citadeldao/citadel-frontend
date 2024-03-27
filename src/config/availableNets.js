import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;
import store from '@/store';

export const networksFilterItems = [
  {
    value: 'all',
    label: `${t('filterAll')}`,
  },
  {
    value: 'hot',
    label: `${t('filterHot')}`,
  },
  {
    value: 'cosmos',
    label: `${t('filterCosmos')}`,
  },
  {
    value: 'evm',
    label: `${t('filterEvm')}`,
  },
  {
    value: 'others',
    label: `${t('filterOthers')}`,
  },
];

export const networksFilterCategory = {
  hot: ['btc', 'eth', 'bsc', 'sui', 'arbitrum', 'polkadot', 'tron'],
  cosmos: [
    'archway',
    'quasar',
    'akash',
    'axelar',
    'band',
    'bitsong',
    'cheqd',
    'chihuahua',
    'comdex',
    'coreum',
    'cosmos',
    'crescent',
    'emoney',
    'evmos',
    'fetch',
    'gbridge',
    'injective',
    'iris',
    'jackal',
    'juno',
    'kava',
    'kichain',
    'konstellation',
    'kujira',
    'lum',
    'mantle',
    'omniflix',
    'osmosis',
    'orai',
    'persistence',
    'provenance',
    'quicksilver',
    'regen',
    'rizon',
    'secret',
    'sentinel',
    'sifchain',
    'stafi',
    'stargaze',
    'starname',
    'stride',
    'teritori',
    'umee',
  ],
  evm: [
    'eth',
    'bsc',
    'arbitrum',
    'polygon',
    'avalanche',
    'evmoseth',
    'optimism',
  ],
  others: ['icon', 'iost', 'oasis'],
};

export const metamaskNets = [
  'bsc',
  'eth',
  'polygon',
  'optimism',
  'arbitrum',
  'evmoseth',
  'avalanche',
];

export const metamaskNetsInfo = {
  bsc: 'Binance Smart Chain',
  eth: 'Ethereum',
  arbitrum: 'Arbitrum One',
  polygon: 'Polygon',
  avalanche: 'Avalanche',
  evmoseth: 'Evmos EVM',
  optimism: 'Optimism',
};

export const trezorNets = ['btc', 'eth', 'bsc']; // 'tez'

export const keplrNetworksProtobufFormat = ['emoney'];
export const keplrNetworks = [
  // for login from keplr
  { label: 'Cosmos Hub', key: 'cosmoshub-4', net: 'cosmos' },
];

export const getKeplrNetworks = () => {
  return Object.keys(store.getters['networks/config'])
    .filter(
      (network) =>
        store.getters['networks/config'][network]?.frontConfiguration?.data
          ?.codebase === 'cosmos-sdk'
    )
    .map((network) => {
      const coin = store.getters['networks/config'][network];

      return {
        label: coin?.primaryToken?.name,
        key: coin?.chainId,
        net: coin?.net,
      };
    });
};

export const showAssetsExep = ['secret', 'bsc'];
export const frozenCanBeStakedNets = ['icon'];
export const hasAccountsNets = ['iost'];
export const hasNoAdvancedSettingsNets = ['polkadot'];
export const hasCustomClaimInfoNets = ['polkadot'];
