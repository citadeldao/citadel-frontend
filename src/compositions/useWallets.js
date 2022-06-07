import store from '@/store';
import { computed } from 'vue';
import { findWalletInArray } from '@/helpers';
import { chartColors } from '@/components/Charts/config';
import BigNumber from 'bignumber.js';
import { WALLET_TYPES } from '@/config/walletType';

export default function useWallets(wallet = null, showCount = undefined) {
  const currentWallet = computed(() => store.getters['wallets/currentWallet'] && findWalletInArray(wallets.value, store.getters['wallets/currentWallet'])) ;

  // instance of given wallet
  const walletByAddress = (walletInfo) =>
    store.getters['wallets/walletByAddress'](walletInfo);

  const wallets = computed(() =>{
    const data = [];
    for(const wallet of store.getters['wallets/wallets'])  {
      store.getters['wallets/walletsStructure'].some(item => item.net.toLowerCase() === wallet.net.toLowerCase() &&
      item.address.toLowerCase() === wallet.address.toLowerCase()) && data.push(wallet);
    }

    return data;
  });

  const marketcap = computed(
    () =>
      store.getters['profile/info']?.marketcap[
        wallet?.net || currentWallet.value?.net
      ],
  );

  const currency = computed(
    () =>
      store.getters['profile/info']?.rates[
        wallet?.net || currentWallet.value?.net
      ],
  );

  const customWalletsLists = computed(
    () => store.getters['wallets/customWalletsList'],
  );
  const currentList = computed(() => store.getters['wallets/activeList']);
  const customList = computed(() => {
    if (customWalletsLists.value.length > 0) {
      const customList = customWalletsLists.value.find(
        (list) => list.name === currentList.value,
      );

      return (customList && customList.wallets) || [];
    }

    return [];
  });

  const currentWalletsList = computed(() => {
    if (currentList.value === 'all') {
      return wallets.value;
    }
    let customListWallets = [];
    for (const { net, address } of customList.value) {
      const data = wallets.value.filter((wallet) => {
        return wallet.address.toLowerCase() === address.toLowerCase() && wallet.net === net;
      });
      customListWallets = customListWallets.concat(data);
    }

    return customListWallets;

  });

  const currentWalletsListWithSubtokensList = computed(() => {
    if (currentList.value === 'all') {
      return wallets.value;
    }

    let customListWallets = [];

    for (const { net, address } of customList.value) {
      const walletsList = wallets.value
        .filter((wallet) => wallet.address.toLowerCase() === address.toLowerCase() && wallet.net === net);
      customListWallets = customListWallets.concat(walletsList);
    }

    return customListWallets;
  });

  const currentWalletListSubtokensList = computed(() => {
    let currentWalletListSubtokensList = [];
    for (const item of currentWalletsListWithSubtokensList.value) {
      const subtokens = item.subtokensList;
      currentWalletListSubtokensList = [
        ...currentWalletListSubtokensList,
        ...subtokens,
      ];
    }
    currentWalletListSubtokensList = currentWalletListSubtokensList.reduce((obj, item) => {

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

      obj[item.net].balance = BigNumber(obj[item.net].balance).plus(balance).toNumber();
      obj[item.net].usd = BigNumber(obj[item.net].usd)
        .plus(
          BigNumber(balance).multipliedBy(item.tokenBalance.price.USD),
        )
        .toNumber();
      obj[item.net].btc = BigNumber(obj[item.net].btc)
        .plus(
          BigNumber(balance).multipliedBy(item.tokenBalance.price.BTC),
        )
        .toNumber();

      return obj;
    }, {});

    return currentWalletListSubtokensList;
  });

  // used in balanceStructure chart
  const walletsBalanceStructure = computed(() => {
    if (!currentWalletsList.value || !currentWalletsList.value.length) {
      return {};
    }

    const struct = currentWalletsList.value.reduce((blncStruct, wlt) => {
      const walletInstance = walletByAddress(wlt);

      if (!walletInstance) {
        return blncStruct;
      }

      if (!blncStruct[wlt.net]?.usd) {
        blncStruct[wlt.net] = {
          percent: 0,
          balance: 0,
          usd: 0,
          btc: 0,
          code: store.getters['networks/configByNet'](wlt.net).code,
          name: store.getters['networks/configByNet'](wlt.net).name,
        };
      }
      const currency = store.getters['profile/info'].rates;
      const balance = wlt.balance.calculatedBalance;
      blncStruct[wlt.net].balance = BigNumber(blncStruct[wlt.net].balance).plus(balance).toNumber();
      blncStruct[wlt.net].usd = BigNumber(blncStruct[wlt.net].usd)
        .plus(
          BigNumber(balance).multipliedBy(currency[wlt.net].USD),
        )
        .toNumber();
      blncStruct[wlt.net].btc = BigNumber(blncStruct[wlt.net].btc)
        .plus(
          BigNumber(balance).multipliedBy(currency[wlt.net].BTC),
        )
        .toNumber();

      return blncStruct;
    }, {});

    return struct;
  });

  const balanceStructure = computed(() => {
    let struct = {
      ...walletsBalanceStructure.value,
      ...currentWalletListSubtokensList.value,
    };
    const count = Object.keys(struct).length;
    const colors = [];

    // fill colors for each balances
    for (let i = 0; i < count; i++) {
      const multiplier = Math.trunc((i / chartColors.length));
      const index = i - (chartColors.length * multiplier);

      colors[i] = chartColors[index];
    }

    const totalUsd = Object.values(struct).reduce((sum, network) => sum + network.usd, 0);

    for (const i in struct) {
      struct[i].percent = (struct[i].usd / totalUsd) * 100;
    }

    struct = Object.fromEntries(
      Object.entries(struct).sort(([, a], [, b]) => b.percent - a.percent),
    );

    for (const i in struct) {
      struct[i].color = colors[Object.keys(struct).indexOf(i)];
    }

    return struct;
  });

  const finalStructure = computed(() => {
    let struct = Object.keys(balanceStructure.value).map(i => ({
      net: i,
      ...balanceStructure.value[i],
    }));
    const firs5items = struct.slice(0, showCount);
    let others = struct.slice(showCount, struct.length - 1);
    const totalUsd = struct.reduce((total, item) => BigNumber(total).plus(item.usd).toNumber(), 0);
    others = {
      net: 'Others',
      usd: others.reduce((total, item) => BigNumber(total).plus(item.usd).toNumber(), 0),
      btc: others.reduce((total, item) => BigNumber(total).plus(item.btc).toNumber(), 0),
      name: 'Others',
      percent: (others.reduce((total, item) => BigNumber(total).plus(item.usd).toNumber(), 0) / totalUsd) * 100,
      color: chartColors[5],
    };

    struct = firs5items.length === struct.length
      ? [...firs5items]
      : [...firs5items, others];

    struct = struct.filter((item) => item.usd);

    return struct.reduce((obj, item) => {
      obj[item.net] = item;

      return obj;
    }, {});
  });

  const isHardwareWallet = computed(() => (
    [WALLET_TYPES.LEDGER, WALLET_TYPES.TREZOR].includes(currentWallet.value.type)
  ));

  return {
    wallets,
    walletByAddress,
    marketcap,
    currency,
    currentWallet,
    balanceStructure: finalStructure,
    isHardwareWallet,
  };
}
