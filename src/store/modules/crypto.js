import { sha3_256 } from 'js-sha3';
import CryptoCoin from '@/models/CryptoCoin';
// import models from '@/models';
import { WALLET_TYPES } from '@/config/walletType';
import notify from '@/plugins/notify';
import citadel from '@citadeldao/lib-citadel';
import BigNumber from 'bignumber.js';
import useWallets from '@/compositions/useWallets';
import { getErrorTextByCode } from '@/config/errors';
import { setStorage, removeStorage } from '@/utils/storage';

const getDefaultState = () => {
  return {
    mnemonic: null,
    migrationPassword: null,
    privateWallets: [],
    passwordHash: null,
    userId: null,
  };
};

export default {
  namespaced: true,
  state: () => ({
    newMnemonic: null,
    mnemonic: null,
    migrationPassword: null,
    privateWallets: null,
    passwordHash: null,
    userId: null,
  }),

  getters: {
    migrationPassword: (state) => state.migrationPassword,
    privateWallets: (state) => state.privateWallets,
    newMnemonic: (state) => state.newMnemonic,
    encodeUserMnemonic: (state) => state.mnemonic,
    passwordHash: (state) => state.passwordHash,
  },

  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setNewMnemonic(state, newMnemonic) {
      state.newMnemonic = newMnemonic;
    },
    resetState(state) {
      removeStorage(`${state.userId}_syncEncodeUserMnemonic`);
      removeStorage(`${state.userId}_syncPasswordHash`);
      Object.assign(state, getDefaultState());
    },
    setUserMnemonic(state, mnemonic) {
      state.mnemonic = mnemonic;
      setStorage(`${state.userId}_syncEncodeUserMnemonic`, mnemonic);
    },
    setPasswordHash(state, passwordHash) {
      state.passwordHash = passwordHash;
      setStorage(`${state.userId}_syncPasswordHash`, passwordHash);
    },
    setMigrationPassword(state, migrationPassword) {
      state.migrationPassword = migrationPassword;
    },
    setPrivateWallets(state, wallets) {
      state.privateWallets = wallets;
    },
  },

  actions: {
    async decodeUserMnemonic({ state }, { password, customMnemonic }) {
      // export from settings when wallet import from seed
      if (customMnemonic) {
        return await CryptoCoin.decodeMnemonic(customMnemonic, password);
      }

      if (!state.mnemonic) {
        return null;
      }

      return await CryptoCoin.decodeMnemonic(state.mnemonic, password);
    },
    async generateNewMnemonic({ commit }) {
      const { result, data } = await citadel.generateMnemonic();

      if (result === 'success') {
        commit('setNewMnemonic', data);
      }
    },
    async resetState({ commit, dispatch }) {
      await dispatch('wallets/setWallets', [], { root: true });
      commit('resetState');
    },

    setPassword({ commit }, password) {
      const passwordHash = sha3_256(password);
      commit('setPasswordHash', passwordHash);
    },

    async setAndEncodeUserMnemonic({ commit }, { mnemonic, password }) {
      const encodeMnemonic = await CryptoCoin.encodeMnemonic(
        mnemonic,
        password
      );
      commit('setUserMnemonic', encodeMnemonic);
    },

    async createNewWalletInstance({ rootGetters }, { walletOpts, password }) {
      try {
        // const WalletConstructor = models[walletOpts.net.toUpperCase()];
        walletOpts.privateKeyEncoded = walletOpts.privateKeyEncoded
          ? walletOpts.privateKeyEncoded
          : walletOpts.privateKey
          ? await /* WalletConstructor */ CryptoCoin.encodePrivateKeyByPassword(
              walletOpts.net,
              walletOpts.privateKey,
              password
            )
          : null;
        // For polka
        if (walletOpts.net === 'polkadot') {
          walletOpts.mnemonicEncoded = walletOpts.mnemonicEncoded
            ? walletOpts.mnemonicEncoded
            : walletOpts.mnemonic
            ? await /* WalletConstructor */ CryptoCoin.encodePrivateKeyByPassword(
                walletOpts.net,
                walletOpts.mnemonic,
                password
              )
            : null;
        }
        walletOpts.config = rootGetters['networks/configByNet'](walletOpts.net);
        const { currency } = useWallets(walletOpts);
        walletOpts.balanceUSD = BigNumber(
          walletOpts?.balance?.calculatedBalance
        )
          .times(currency.value?.USD)
          .toNumber();
        const walletInstance = new /* WalletConstructor */ CryptoCoin(
          walletOpts,
          password
        );
        delete walletInstance.privateKey;
        return walletInstance;
      } catch (error) {
        notify({
          type: 'warning',
          text: error,
        });
        console.error(error);
        throw error;
      }
    },

    async createWalletByMnemonic(
      { rootGetters, dispatch },
      { walletOpts, password }
    ) {
      try {
        const derivationPath = walletOpts.pathIndex
          ? /* models[walletOpts.net.toUpperCase()] */ CryptoCoin.getDerivationPath(
              walletOpts.net,
              walletOpts.pathIndex
            )
          : walletOpts.derivationPath;
        const { error, data } = await citadel.createWalletByMnemonic({
          ...walletOpts,
          derivationPath,
        });
        const wallet = {
          ...data,
          name: data.networkName,
        };
        const walletInstance = await dispatch('createNewWalletInstance', {
          walletOpts: wallet,
          password,
        });

        if (!error) {
          const existingWallet =
            rootGetters['wallets/walletByAddress'](walletInstance);

          return {
            walletInstance,
            alreadyExist:
              !!existingWallet &&
              existingWallet.type !== WALLET_TYPES.PUBLIC_KEY,
          };
        }

        return {};
      } catch (error) {
        notify({
          type: 'warning',
          text: error,
        });
        console.error(error);
        throw error;
      }
    },

    async createKeplrWallet({ rootGetters }, walletOpts) {
      const config = rootGetters['networks/configByNet'](walletOpts.net);
      const publicKey = rootGetters['keplr/keplrConnector'].accounts[0].pubkey;
      const pb = Buffer.from(publicKey).toString('hex');

      try {
        const walletInstance = await CryptoCoin.createWalletByKeplr({
          ...walletOpts,
          publicKey: pb,
          type: WALLET_TYPES.KEPLR,
          config,
        });
        const keplrInstance = {
          ...walletInstance,
          publicKey: pb,
          address: walletOpts.address,
          net: walletOpts.net,
          type: WALLET_TYPES.KEPLR,
        };
        const existingWallet =
          rootGetters['wallets/walletByAddress'](keplrInstance);

        return {
          data: {
            walletInstance: keplrInstance,
            alreadyExist:
              !!existingWallet &&
              existingWallet.type !== WALLET_TYPES.PUBLIC_KEY,
          },
          error: false,
        };
      } catch (error) {
        console.error(error);

        return { data: null, error: error.message || error };
      }
    },

    async addHardwareWalletToAccount({ dispatch }, { wallet }) {
      const { error, data } = await citadel.addCreatedWallet({
        ...wallet.config,
        ...wallet,
        networkName: wallet.config.name,
      });

      if (!error) {
        const newWalletInstance = await dispatch('createNewWalletInstance', {
          walletOpts: { ...data, derivationPath: wallet.derivationPath },
        });

        return { newWalletInstance, error };
      }

      notify({
        type: 'warning',
        text: error,
      });

      return { error };
    },
    async createLedgerWallet({ rootGetters, dispatch }, walletOpts) {
      try {
        const derivationPath = walletOpts.pathIndex
          ? /* models[walletOpts.net.toUpperCase()] */ CryptoCoin.getDerivationPath(
              walletOpts.net,
              walletOpts.pathIndex,
              WALLET_TYPES.LEDGER
            )
          : walletOpts.derivationPath;
        const { error, data } = await citadel.createWalletByLedger({
          ...walletOpts,
          derivationPath,
        });
        if (error) {
          const errorMessage = getErrorTextByCode(error);
          notify({
            type: 'warning',
            text: errorMessage,
          });

          return {
            walletInstance: {},
            alreadyExist: false,
            error: errorMessage,
          };
        }
        const walletInstance = await dispatch('createNewWalletInstance', {
          walletOpts: data,
        });

        const existingWallet =
          rootGetters['wallets/walletByAddress'](walletInstance);

        return {
          walletInstance,
          alreadyExist:
            !!existingWallet && existingWallet.type !== WALLET_TYPES.PUBLIC_KEY,
        };
      } catch (error) {
        return { error: error.message || error };
      }
    },

    async checkTrezorConnection() {
      const { error } = await citadel.checkTrezorConnect();

      return { error };
    },

    async createTrezorWallet({ dispatch, rootGetters }, walletOpts) {
      try {
        const { error, data } = await citadel.createWalletByTrezor(walletOpts);
        const walletInstance = await dispatch('createNewWalletInstance', {
          walletOpts: data,
        });

        if (!error) {
          const existingWallet =
            rootGetters['wallets/walletByAddress'](walletInstance);

          return {
            walletInstance,
            alreadyExist:
              !!existingWallet &&
              existingWallet.type !== WALLET_TYPES.PUBLIC_KEY,
          };
        }

        notify({
          type: 'warning',
          text: error,
        });

        return {
          walletInstance: {},
          alreadyExist: false,
        };
      } catch (error) {
        console.error(error);

        return { error: error.message || error };
      }
    },
  },
};
