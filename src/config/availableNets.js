import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

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
  { label: 'Cosmos Hub', key: 'cosmoshub-4', net: 'cosmos' },
  { label: 'Akash', key: 'akashnet-2', net: 'akash' },
  { label: 'Band', key: 'laozi-mainnet', net: 'band' },
  { label: 'Chihuahua', key: 'chihuahua-1', net: 'chihuahua' },
  { label: 'Comdex', key: 'comdex-1', net: 'comdex' },
  { label: 'Juno', key: 'juno-1', net: 'juno' },
  { label: 'Kava', key: 'kava_2222-10', net: 'kava' },
  { label: 'Osmosis', key: 'osmosis-1', net: 'osmosis' },
  { label: 'Persistence', key: 'core-1', net: 'persistence' },
  { label: 'Sentinel', key: 'sentinelhub-2', net: 'sentinel' },
  { label: 'Stargaze', key: 'stargaze-1', net: 'stargaze' },
  { label: 'Secret', key: 'secret-4', net: 'secret' },
  { label: 'Axelar', key: 'axelar-dojo-1', net: 'axelar' },
  { label: 'Bitsong', key: 'bitsong-2b', net: 'bitsong' },
  { label: 'Cheqd', key: 'cheqd-mainnet-1', net: 'cheqd' },
  { label: 'e-Money', key: 'emoney-3', net: 'emoney' },
  { label: 'Evmos', key: 'evmos_9001-2', net: 'evmos' },
  { label: 'Fetch.ai', key: 'fetchhub-3', net: 'fetch' },
  { label: 'Injective', key: 'injective-1', net: 'injective' },
  { label: 'Ki Chain', key: 'kichain-2', net: 'kichain' },
  { label: 'Lum', key: 'lum-network-1', net: 'lum' },
  { label: 'Rizon', key: 'titan-1', net: 'rizon' },
  { label: 'Sifchain', key: 'sifchain-1', net: 'sifchain' },
  { label: 'Umee', key: 'umee-1', net: 'umee' },
  { label: 'Regen', key: 'regen-1', net: 'regen' },
  { label: 'Iris Network', key: 'irishub-1', net: 'iris' },
  {
    label: 'Starname',
    key: 'iov-mainnet-ibc',
    net: 'starname',
  },
  { label: 'Konstellation', key: 'darchub', net: 'konstellation' },
  {
    label: 'Gravity Bridge',
    key: 'gravity-bridge-3',
    net: 'gbridge',
  },
  { label: 'AssetMantle', key: 'mantle-1', net: 'mantle' },
  { label: 'Crescent', key: 'crescent-1', net: 'crescent' },
  { label: 'Stride', key: 'stride-1', net: 'stride' },
  { label: 'Stafi', key: 'stafihub-1', net: 'stafi' },
  { label: 'Jackal', key: 'jackal-1', net: 'jackal' },
  { label: 'Omniflix', key: 'omniflixhub-1', net: 'omniflix' },
  { label: 'Teritori', key: 'teritori-1', net: 'teritori' },
  { label: 'Quicksilver', key: 'quicksilver-2', net: 'quicksilver' },
  { label: 'Kujira', key: 'kaiyo-1', net: 'kujira' },
  { label: 'Coreum', key: 'coreum-mainnet-1', net: 'coreum' },
  { label: 'Orai', key: 'Oraichain', net: 'orai' },
  { label: 'Provenance', key: 'pio-mainnet-1', net: 'provenance' },
  { label: 'Nolus', key: 'pirin-1', net: 'nolus' },
];

export const showAssetsExep = ['secret', 'bsc'];
export const frozenCanBeStakedNets = ['icon'];
export const hasAccountsNets = ['iost'];
export const hasNoAdvancedSettingsNets = ['polkadot'];
export const hasCustomClaimInfoNets = ['polkadot'];
