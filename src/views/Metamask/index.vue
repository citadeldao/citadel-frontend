<template>
  <div class="metamask">
    <Header
      :title="$t('metamask.titleModal')"
      :info="$t('metamask.descModal')"
    />
    <Modal v-if="showLoader">
      <Loading />
    </Modal>
    <section class="metamask__section">
      <div class="import-container">
        <div class="import-container__icon">
          <div v-if="!currentIcon">?</div>
          <component v-else :is="currentIcon" />
        </div>
        <div class="import-container__address">
          <p>{{ networkName }}</p>
          {{ metamaskConnector.accounts[0] }}
        </div>
      </div>
      <div class="btn__container">
        <PrimaryButton class="confirm" @click="importWallet">
          {{ $t('confirm') }}
        </PrimaryButton>
        <!-- <PrimaryButton class="no-decoration" @click="cancel">
          {{ $t('metamask.cancel') }}
        </PrimaryButton> -->
      </div>
    </section>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import CatPage from '@/components/CatPage';
import ModalCard from '@/components/ModalCard';
import Modal from '@/components/Modal';
import { ref, computed, watch, markRaw, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import notify from '@/plugins/notify';
import useWallets from '@/compositions/useWallets';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '@/config/walletType';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import AddressAlreadyAdded from '@/components/Modals/AddressAlreadyAdded';
import { INPUT_TYPE_ICON } from '@/config/newWallets';
import { metamaskNets } from '@/config/availableNets';
import Header from '../AddAddress/components/Header';

import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export default {
  name: 'Metamask',
  components: {
    CatPage,
    Loading,
    Modal,
    ModalCard,
    ModalContent,
    PrimaryButton,
    AddressAlreadyAdded,
    Header,
  },
  setup() {
    const store = useStore();
    const importModal = ref(true);
    const showModal = ref(false);
    const { wallets } = useWallets();
    const currentIcon = ref();
    const showLoader = ref(true);
    const existAddressInMetamask = ref(false);
    const {
      setAddress,
      setNets,
      createWallets,
      newWallets,
      redirectToNewWallet,
    } = useCreateWallets();

    store.dispatch('metamask/connectToMetamask');

    const timeOut = setTimeout(() => {
      if (showLoader.value) {
        showLoader.value = false;
        router.push('/add-address/import-existing-address/metamask-keplr');
      }
    }, 15000);
    onMounted(() => {
      store.commit('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.METAMASK,
        walletTypePlaceholder: 'Citadel Metamask',
      });
    });
    onUnmounted(() => {
      clearInterval(timeOut);
    });

    const metamaskConnector = computed(
      () => store.getters['metamask/metamaskConnector']
    );
    const networkName = computed(
      () =>
        store.getters['networks/networksList'].find(
          (e) => e.net === metamaskConnector.value.network
        ).name
    );
    // metamaskConnector.value.changeNetwork();

    const checkAccessToMetamask = () => {
      if (!window.ethereum) {
        notify({
          type: 'warning',
          text: t('metamask.notFound'),
        });
        setTimeout(() => {
          router.push('/add-address');
        }, 1000);

        return;
      }

      if (!metamaskNets.includes(metamaskConnector.value.network)) {
        notify({
          type: 'warning',
          text: t('metamask.changeNetwork'),
        });
      }
    };

    checkAccessToMetamask();

    watch(
      () => metamaskConnector.value.accounts,
      () => {
        const { network, accounts } = metamaskConnector.value;

        if (accounts && accounts[0]) {
          showLoader.value = false;
        }

        if (metamaskNets.includes(network)) {
          import(`@/assets/icons/networks/${network}.svg`).then((val) => {
            currentIcon.value = markRaw(val.default);
          });
        } else {
          currentIcon.value = '';
        }
      }
    );

    watch(
      () => metamaskConnector.value.network,
      (newV) => {
        const network = newV;

        if (metamaskNets.includes(network)) {
          import(`@/assets/icons/networks/${network}.svg`).then((val) => {
            currentIcon.value = markRaw(val.default);
          });
        } else {
          currentIcon.value = '';
        }
      }
    );

    const router = useRouter();

    const importWallet = async () => {
      store.commit('newWallets/setLoader', true);
      const { network, accounts } = metamaskConnector.value;

      if (!metamaskNets.includes(metamaskConnector.value.network)) {
        notify({
          type: 'warning',
          text: t('metamask.changeNetwork'),
        });

        return;
      }

      if (!accounts[0]) {
        return;
      }

      existAddressInMetamask.value = wallets.value.find(
        (wallet) =>
          wallet.address.toLowerCase() === accounts[0].toLowerCase() &&
          wallet.net === network
      );

      if (!existAddressInMetamask.value) {
        setAddress(accounts[0]);
        setNets([network]);
        await createWallets(WALLET_TYPES.PUBLIC_KEY);
        // eslint-disable-next-line prefer-destructuring
        existAddressInMetamask.value = newWallets.value[0];
      } else {
        store.commit(
          'newWallets/setNewWalletsList',
          [existAddressInMetamask.value] || newWallets.value
        );
        store.commit('newWallets/setLoader', false);
        store.commit('newWallets/setAlreadyAddedModal', true);
      }

      await redirectToNewWallet();
      store.commit('newWallets/setNewWalletsList', newWallets.value);
      store.commit('newWallets/setModal', true);
      store.commit('newWallets/setLoader', false);
      importModal.value = false;
    };

    const cancel = () => {
      router.push({ name: 'MetamaskKeplr' });
    };

    return {
      importModal,
      metamaskConnector,
      showModal,
      showLoader,
      currentIcon,
      existAddressInMetamask,
      networkName,
      importWallet,
      cancel,
    };
  },
};
</script>

<style lang="scss" scoped>
.import-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 80px;
  background: #f0f3fd;
  border-radius: 8px;
  align-self: center;
  &__address {
    max-width: 297px;
    overflow-y: clip;
    text-overflow: ellipsis;
    color: $dark-blue;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    p {
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      margin: 0 0 8px 0;
      color: initial;
    }
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    text-align: center;
    padding: 13px 0;
    margin-right: 8px;

    & svg {
      fill: white;
      height: 24px;
    }

    background: $dark-blue;
  }
}
.metamask {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px 40px;
  flex-grow: 1;

  @include lg {
    padding: 0 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 0 31px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    padding-bottom: 40px;
    margin-top: 48px;
  }
}
.btn__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  button {
    margin-top: 22px;
    @include md {
      margin-top: 32px;
    }
  }
}
</style>
