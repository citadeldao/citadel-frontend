/* eslint-disable */
import { ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import CryptoCoin from '@/models/CryptoCoin';
import { WALLET_TYPES } from '@/config/walletType';
import citadel from '@citadeldao/lib-citadel';
import models from '@/models';
import notify from '@/plugins/notify';
import redirectToWallet from '@/router/helpers/redirectToWallet';
import { findWalletInArray } from '@/helpers';
import useWallets from '@/compositions/useWallets';

export default function useCreateWallets() {
  const store = useStore();
  const { wallets } = useWallets();
  const isUserMnemonic = computed(
    () => !!store.getters['crypto/encodeUserMnemonic'],
  );

  const isPasswordHash = computed(() => store.getters['crypto/passwordHash']);

  const showModal = ref(false);
  const showAlreadyAddedModal = ref(false);
  const showLoader = ref(false);
  const newWallets = ref([]);
  const walletOpts = reactive({});

  const setPassword = (password) => {
    walletOpts.password = password;
  };

  const savePassword = () =>
    store.dispatch('crypto/setPassword', walletOpts.password);

  const userMnemonic = (password) =>
    store.getters['crypto/decodeUserMnemonic'](password);

  const setMnemonic = (mnemonic) => {
    walletOpts.mnemonic = mnemonic || userMnemonic(walletOpts.password);
  };

  const saveMnemonic = () => {
    store.dispatch('crypto/setAndEncodeUserMnemonic', walletOpts);
  };

  const setPassphrase = (passphrase) => {
    walletOpts.passphrase = passphrase;
  };

  const setPrivateKey = (privateKey) => {
    walletOpts.privateKey = privateKey;
  };

  const setDerivationPath = (derivationPath) => {
    walletOpts.derivationPath = derivationPath;
  };

  const setNets = (nets) => {
    walletOpts.nets = nets;
  };

  const setAddress = (address) => {
    walletOpts.address = address;
  };

  const setAccount = (account) => {
    walletOpts.account = account;
  };

  const setPublicKey = (pk) => {
    walletOpts.publicKey = pk;
  };

  const setType = (type) => {
    walletOpts.type = type;
  };

  const setImportedFromSeed = () => {
    walletOpts.importedFromSeed = CryptoCoin.encodeMnemonic(
      walletOpts.mnemonic,
      walletOpts.password,
    );
  };

  const createWallets = async (type) => {
    const newWalletType = type || walletOpts.type;
    try {
      showModal.value = true;
      showLoader.value = true;
      let newWalletsList;
      let errorMessage;
      const mapWallets = (arr) => {
        return arr.map((net) => {
          return {
            address: walletOpts.address,
            net,
            mnemonic: walletOpts.mnemonic,
            privateKey: walletOpts.privateKey || null,
            derivationPath: walletOpts.derivationPath ||
              `${models[net.toUpperCase()].getDerivationPath(net, store.getters['wallets/freePathIndex']({ net }))}`
              || '',
            type: newWalletType,
            account: walletOpts.account,
            passphrase: walletOpts.passphrase,
          };
        });
      };
      const newWalletsOptsList = mapWallets(walletOpts.nets[1]);
      const oldWalletsOptsList = mapWallets(walletOpts.nets[0]);
      const allWalletsList = oldWalletsOptsList.concat(newWalletsOptsList)

      const allAddressList = wallets.value.filter(e => allWalletsList.findIndex(e2 => e2.net === e.net))
      
      if (newWalletType === WALLET_TYPES.ONE_SEED && newWalletsOptsList.length) {
        const { data, error } = await citadel.addWalletCollectionByMnemonic(newWalletsOptsList);
        newWalletsList = data;
        errorMessage = error;
      }
      if (newWalletType === WALLET_TYPES.KEPLR) {
        const config = store.getters['networks/configByNet'](walletOpts.nets[0]);
        const { data, error } = await citadel.addCreatedWallet({
          ...config,
          net: walletOpts.nets[0],
          address: walletOpts.address,
          type: newWalletType,
          publicKey: walletOpts.publicKey,
          networkName: config.name,
        });
        newWalletsList = data ? [data] : [];
        errorMessage = error;
      }

      if (newWalletType === WALLET_TYPES.PRIVATE_KEY) {
        const { data, error } = await citadel.addWalletCollectionByPrivateKey(newWalletsOptsList);
        newWalletsList = data;
        errorMessage = error;
      }

      if (newWalletType === WALLET_TYPES.PUBLIC_KEY) {
        const { data, error } = await citadel.addWalletCollectionByPublicKey(newWalletsOptsList);
        newWalletsList = data;
        errorMessage = error;
      }

      if (errorMessage) {
        notify({
          type: 'warning',
          text: errorMessage,
        });
        router.push({ name: 'AddAddress' });
        showModal.value = false;
        showLoader.value = false;

        return;
      }
      if (newWalletsList) {
        for (const item of newWalletsList) {
          if (item.error) {
            notify({
              type: 'warning',
              text: item.error,
            });
          } else {
            const newInstance = await store.dispatch('crypto/createNewWalletInstance', {
              walletOpts: {
                ...item,
                importedFromSeed: walletOpts.importedFromSeed,
              },
              password: walletOpts.password,
            });
            newWallets.value.push(newInstance);
            await store.dispatch('wallets/pushWallets', { wallets: [newInstance] });
          }
        }
      }

      // await store.dispatch('wallets/getNewWallets', 'lazy');
      // store.dispatch('wallets/getNewWallets', 'detail');
      if (!newWallets.value.length) {
        newWallets.value = allAddressList.map((item) => {
          return item
        }
        );
        showLoader.value = false;
        showAlreadyAddedModal.value = true;

        return;
      }

      const success = !![...newWallets.value].filter((w) => w).length;
      showModal.value = false;
      showLoader.value = false;
      if (success) {
        showModal.value = true;
      }

      return success;
    } catch (err) {
      showModal.value = false;
      showLoader.value = false;
    }
  };

  const router = useRouter();
  const redirectToNewWallet = async () => {
    await redirectToWallet({
      wallet: newWallets.value[0],
      root: true,
    });
  };

  return {
    showModal,
    newWallets,
    setPassword,
    setMnemonic,
    setPrivateKey,
    setDerivationPath,
    setNets,
    setType,
    saveMnemonic,
    savePassword,
    createWallets,
    walletOpts,
    isUserMnemonic,
    isPasswordHash,
    setPassphrase,
    setImportedFromSeed,
    userMnemonic,
    showLoader,
    setAddress,
    redirectToNewWallet,
    showAlreadyAddedModal,
    setAccount,
    setPublicKey,
  };
}
