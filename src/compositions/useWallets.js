import store from '@/store';
import { computed } from 'vue';
import { findWalletInArray } from '@/helpers';

import { chartColors, OTHERS_COLOR } from '@/components/Charts/config';
import { coinColors, ethCoinColors } from '@/components/Charts/coinColors';

import BigNumber from 'bignumber.js';
import { WALLET_TYPES } from '@/config/walletType';

const GETTERS = {
  RATES: 'profile/rates',
  MARKET: 'profile/marketcaps',

  CSTM_WLT_LIST: 'wallets/customWalletsList',

  ACTIVE_WLT_LIST: 'wallets/activeList',

  WLT_LIST: 'wallets/wallets',
  WLT_STRUCT: 'wallets/walletsStructure',
  WLT_BY_ADDR: 'wallets/walletByAddress',

  CURR_WLT: 'wallets/currentWallet',

  SUB_TKN_LIST: 'subtokens/formatedSubtokens',
  CURR_SUB_TKN: 'subtokens/currentToken',

  CONFIG_BY_NET: 'networks/configByNet',
};

const walletByAddress = (walletInfo) => {
  return store.getters[GETTERS.WLT_BY_ADDR](walletInfo);
};

const getRecordFromList = (getter, list) => {
  const record = store.getters[getter];
  if (record) return findWalletInArray(list, { ...record });
  return undefined;
};

export default function useWallets(wallet = null, showCount = undefined) {
  /**
   *
   * @Configurations
   * Wallets and Tokens list
   *
   */

  const ALL_WALLETS = computed(() => {
    const data = [];

    for (const wallet of store.getters[GETTERS.WLT_LIST]) {
      const walletsStructure = store.getters[GETTERS.WLT_STRUCT];
      if (walletsStructure) {
        walletsStructure.some((item) => {
          const net = item.net.toLowerCase();
          const walletNet = wallet.net.toLowerCase();
          const address = item.address.toLowerCase();
          const walletAddress = wallet.address.toLowerCase();

          return net === walletNet && address === walletAddress;
        }) && data.push(wallet);
      }
    }

    return data;
  });

  const SUB_TOKENS_LIST = computed(store.getters[GETTERS.SUB_TKN_LIST]);

  /**
   *
   * @Configurations
   * Target Wallet and Token
   *
   */

  const ACTUAL_WALLET = computed(() =>
    getRecordFromList(GETTERS.CURR_WLT, ALL_WALLETS.value)
  );

  const TOKEN = computed(() =>
    getRecordFromList(GETTERS.CURR_SUB_TKN, SUB_TOKENS_LIST.value)
  );

  /**
   *
   * @Configurations
   * Main variables
   *
   */

  const NETWORK = computed(() => wallet?.net || ACTUAL_WALLET.value?.net);
  const CURRENCY_RATE = computed(
    () => store.getters[GETTERS.RATES]?.[NETWORK.value]
  );
  const MARKETCAP = computed(
    () => store.getters[GETTERS.MARKET]?.[NETWORK.value]
  );

  /**
   *
   * @Configurations
   * Custom Wallets List
   *
   */

  const ACTIVE_LIST = computed(() => store.getters[GETTERS.ACTIVE_WLT_LIST]);
  const CUSTOM_WLT_LIST = computed(() => store.getters[GETTERS.CSTM_WLT_LIST]);

  const customList = computed(() => {
    if (CUSTOM_WLT_LIST.value.length <= 0) return [];
    const customList = CUSTOM_WLT_LIST.value.find(
      (list) => list.name === ACTIVE_LIST.value
    );
    return (customList && customList.wallets) || [];
  });

  const currentWalletsList = computed(() => {
    if (ACTIVE_LIST.value === 'all') return ALL_WALLETS.value;

    let customListWallets = [];

    for (const { net, address } of customList.value) {
      const data = ALL_WALLETS.value.filter((wallet) => {
        return (
          wallet.address.toLowerCase() === address.toLowerCase() &&
          wallet.net === net
        );
      });
      customListWallets = customListWallets.concat(data);
    }

    return customListWallets;
  });

  const currentWalletsListWithSubtokensList = currentWalletsList;

  const currentWalletListSubtokensList = computed(() => {
    let tokensList = [];

    for (const item of currentWalletsListWithSubtokensList.value) {
      const subtokens = item.subtokensList;
      tokensList = [...tokensList, ...subtokens];
    }

    tokensList = tokensList.reduce((obj, item) => {
      if (!obj[item.net]?.usd) {
        obj[item.net] = {
          balance: 0,
          btc: 0,
          code: item.code,
          name: item.name,
          percent: 0,
          usd: 0,
        };
      }

      const balance = item.tokenBalance.calculatedBalance;

      obj[item.net].balance = BigNumber(obj[item.net].balance)
        .plus(balance)
        .toNumber();
      obj[item.net].usd = BigNumber(obj[item.net].usd)
        .plus(BigNumber(balance).multipliedBy(item.tokenBalance.price.USD))
        .toNumber();
      obj[item.net].btc = BigNumber(obj[item.net].btc)
        .plus(BigNumber(balance).multipliedBy(item.tokenBalance.price.BTC))
        .toNumber();

      return obj;
    }, {});

    return tokensList;
  });

  /**
   *
   * @Configurations
   * Balance Structure Chart
   *
   */

  const walletsBalanceStructure = computed(() => {
    if (!currentWalletsList.value || !currentWalletsList.value.length) {
      return {};
    }

    const struct = currentWalletsList.value.reduce((blncStruct, wlt) => {
      const walletInstance = walletByAddress(wlt);

      if (!walletInstance) return blncStruct;

      if (!blncStruct[wlt.net]?.usd) {
        blncStruct[wlt.net] = {
          percent: 0,
          balance: 0,
          usd: 0,
          btc: 0,
          code: store.getters[GETTERS.CONFIG_BY_NET](wlt.net).code,
          name: store.getters[GETTERS.CONFIG_BY_NET](wlt.net).name,
        };
      }

      const currency = store.getters[GETTERS.RATES];

      const balance = wlt.balance.calculatedBalance;

      const BALANCE_RATE_USD = BigNumber(balance).multipliedBy(
        currency[wlt.net].USD
      );
      const BALANCE_RATE_BTC = BigNumber(balance).multipliedBy(
        currency[wlt.net].BTC
      );

      const calcBalance = (value, currencyBalance) => {
        return BigNumber(value).plus(currencyBalance).toNumber();
      };

      blncStruct[wlt.net].balance = calcBalance(
        blncStruct[wlt.net].balance,
        balance
      );

      blncStruct[wlt.net].usd = calcBalance(
        blncStruct[wlt.net].usd,
        BALANCE_RATE_USD
      );

      blncStruct[wlt.net].btc = calcBalance(
        blncStruct[wlt.net].btc,
        BALANCE_RATE_BTC
      );

      return blncStruct;
    }, {});

    return struct;
  });

  const balanceStructure = computed(() => {
    const getTotalValue = (list, key) => {
      return list.reduce(
        (total, coin) => BigNumber(total).plus(coin[key]).toNumber(),
        0
      );
    };

    const getPercentageValue = (amount, total) => {
      return BigNumber(amount).dividedBy(total).multipliedBy(100).toFixed(3);
    };

    const ALL_WALLETS = {
      ...walletsBalanceStructure.value,
      ...currentWalletListSubtokensList.value,
    };

    const FINAL_RESULT = {};

    const netKeys = Object.keys(ALL_WALLETS);

    const count = netKeys.length;
    const colors = [];

    for (let i = 0; i < count; i++) {
      const multiplier = Math.trunc(i / chartColors.length);
      const index = i - chartColors.length * multiplier;
      colors[i] = chartColors[index];
    }

    const TOTAL_USD = getTotalValue(Object.values(ALL_WALLETS), 'usd');

    for (const coin in ALL_WALLETS) {
      ALL_WALLETS[coin].percent = getPercentageValue(
        ALL_WALLETS[coin].usd,
        TOTAL_USD
      );

      const code = ALL_WALLETS[coin].code.toUpperCase();

      if (ethCoinColors[coin]) ALL_WALLETS[coin].color = ethCoinColors[coin];
      else if (coinColors[code]) ALL_WALLETS[coin].color = coinColors[code];
      else ALL_WALLETS[coin].color = colors[netKeys.indexOf(coin)];
    }

    let allDataList = [];

    for (const net in ALL_WALLETS) {
      allDataList.push({
        net,
        ...ALL_WALLETS[net],
      });
    }

    allDataList = allDataList.sort((prev, next) => next.percent - prev.percent);

    const TOP_5 = allDataList.slice(0, showCount);

    const othersList = allDataList.slice(showCount, allDataList.length - 1);

    const othersTotalUSD = getTotalValue(othersList, 'usd');
    const othersTotalBTC = getTotalValue(othersList, 'btc');

    const otherPercent = getPercentageValue(othersTotalUSD, TOTAL_USD);

    const othersObj = {
      name: 'Others',
      net: 'Others',
      usd: othersTotalUSD,
      btc: othersTotalBTC,
      percent: otherPercent,
      color: OTHERS_COLOR,
    };

    if (TOP_5.length === allDataList.length) allDataList = [...TOP_5];
    else allDataList = [...TOP_5, othersObj];

    allDataList = allDataList.filter((item) => item.usd);

    for (const coin of allDataList) {
      FINAL_RESULT[coin.net] = coin;
    }

    return FINAL_RESULT;
  });

  const isHardwareWallet = computed(() =>
    [WALLET_TYPES.LEDGER, WALLET_TYPES.TREZOR].includes(
      ACTUAL_WALLET.value.type
    )
  );

  return {
    wallets: ALL_WALLETS,
    walletByAddress,
    marketcap: MARKETCAP,
    currency: CURRENCY_RATE,
    currentWallet: ACTUAL_WALLET,
    balanceStructure,
    isHardwareWallet,
    currentToken: TOKEN,
  };
}
