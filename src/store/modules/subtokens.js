import useWallets from '@/compositions/useWallets';
import notify from '@/plugins/notify';
import BigNumber from 'bignumber.js';
import citadel from '@citadeldao/lib-citadel';
import CryptoToken from '@/models/CryptoCoins/CryptoToken';

const types = {
  SET_INFLATIONI_INFO_XCT: 'SET_INFLATIONI_INFO_XCT',
  SET_FORMATED_SUBTOKENS: 'SET_FORMATED_SUBTOKENS',
  SET_CURRENT_TOKEN_BALANCE: 'SET_CURRENT_TOKEN_BALANCE',
  SET_CURRENT_TOKEN: 'SET_CURRENT_TOKEN',
  SET_TOKEN_BALANCE: 'SET_TOKEN_BALANCE',
};

export default {
  namespaced: true,
  state: () => ({
    inflationInfoXCT: {},
    formatedSubtokens: [],
    currentToken: null,
  }),

  getters: {
    inflationInfoXCT: (state) => state.inflationInfoXCT,
    formatedSubtokens:
      (state, getters, rootState, rootGetters) =>
      (onlyLinked = false, wallet) => {
        const { currentWallet: stateCurrentWallet } = useWallets();
        const currentWallet =
          rootGetters['wallets/walletByAddress'](wallet) ||
          stateCurrentWallet.value;

        const subtokens = onlyLinked
          ? currentWallet.subtokensList
          : rootGetters['networks/getSubtokensByNet'](currentWallet.net).reduce(
              (acc, token) => {
                return acc.some((t) => t.net === token.net)
                  ? acc
                  : [...acc, token];
              },
              currentWallet.subtokensList
            );

        const formattedSubtokens = subtokens.map((item) => {
          const { data: actions } = citadel.getTokenActions(
            currentWallet.id,
            item.net
          );

          const config =
            rootGetters['networks/configByNet'](currentWallet.net)?.tokens?.[
              item.net
            ] || null;
          const tokenBalance = item.tokenBalance || {
            adding: [],
            delegatedBalance: 0,
            frozenBalance: 0,
            mainBalance: 0,
            originatedAddresses: [],
            stake: 0,
            unstake: 0,
            price: { USD: 0 },
            linked: false,
            calculatedBalance: 0,
            claimableRewards: 0,
          };

          const walletOpts = {
            viewingKey: item.viewingKey,
            address: currentWallet.address,
            type: currentWallet.type,
            derivationPath: currentWallet.derivationPath,
            mnemonicEncoded: currentWallet.mnemonicEncoded,
            privateKeyEncoded: currentWallet.privateKeyEncoded,
            publicKey: currentWallet.publicKey,
            linked: tokenBalance.linked,
            parentCoin: { net: currentWallet.net, code: currentWallet.code },
            fee_key: currentWallet.fee_key,
            id: currentWallet.id,
            savedViewingKey: item.savedViewingKey,
            config,
            actions,
            hasXCT: currentWallet.hasXCT,
            balanceUSD: BigNumber(tokenBalance.calculatedBalance)
              .times(tokenBalance.price.USD)
              .toNumber(),
          };
          const newInstance = new CryptoToken(walletOpts, tokenBalance);

          return newInstance;
        });

        return formattedSubtokens.sort((a) => (a.linked ? -1 : 1));
      },

    currentToken: (state) => state.currentToken,
  },

  mutations: {
    [types.SET_INFLATIONI_INFO_XCT](state, inflationInfoXCT) {
      state.inflationInfoXCT = inflationInfoXCT;
    },
    [types.SET_FORMATED_SUBTOKENS](state, formatedSubtokens) {
      state.formatedSubtokens = formatedSubtokens;
    },
    [types.SET_CURRENT_TOKEN](state, token) {
      state.currentToken = token;
    },
    [types.SET_TOKEN_BALANCE](state, { token, balance }) {
      state.subtokenBalances[token] = {
        ...state.subtokenBalances[token],
        ...balance,
      };
    },
  },

  actions: {
    async getInflationInfoXCT({ commit }, walletId) {
      const { error, data } = await citadel.callTokenInfo(
        walletId,
        'bsc_xct',
        'inflation'
      );

      if (!error) {
        commit(types.SET_INFLATIONI_INFO_XCT, data);
      } else {
        notify({
          type: 'warning',
          text: error,
        });
      }
    },
    setCurrentToken({ commit }, token) {
      commit(types.SET_CURRENT_TOKEN, token);
    },
  },
};
