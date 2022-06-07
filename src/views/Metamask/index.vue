<template>
  <div class="matamask">
    <teleport
      v-if="importModal"
      to="body"
    >
      <Modal v-if="metamaskConnector.accounts && metamaskConnector.accounts[0]">
        <ModalContent
          :submit-button="false"
          :hide-close="true"
          :title="$t('metamask.titleModal')"
          :desc="$t('metamask.descModal')"
          :button-text="$t('metamask.importWallet')"
          :button-text2="$t('metamask.cancel')"
          @buttonClick="importWallet"
          @buttonClick2="cancel"
        >
          <div class="import-container">
            <div class="import-container__icon">
              <div v-if="!currentIcon">
                ?
              </div>
              <div v-else>
                <component :is="currentIcon" />
              </div>
            </div>
            <div class="import-container__address">
              {{ metamaskConnector.accounts[0] }}
            </div>
          </div>
        </ModalContent>
      </Modal>
      <Modal v-if="showLoader">
        <Loading />
      </Modal>
    </teleport>
    <teleport
      v-if="showModal"
      to="body"
    >
      <Modal v-if="showAlreadyAddedModal">
        <AddressAlreadyAdded
          v-click-away="alreadyAddedCloseHandler"
          @close="alreadyAddedCloseHandler"
          @buttonClick="alreadyAddedCloseHandler"
        />
      </Modal>
      <Modal v-else>
        <CatPage
          v-click-away="modalCloseHandler"
          :is-metamask="true"
          input-type-icon="metamask-dot"
          :wallet-type-placeholder="'Citadel Metamask'"
          :data="[existAddressInMetamask]"
          @close="modalCloseHandler"
          @buttonClick="modalCloseHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import CatPage from '@/components/CatPage';
import ModalCard from '@/components/ModalCard';
import Modal from '@/components/Modal';
import { ref, computed, watch, markRaw } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import notify from '@/plugins/notify';
import useWallets from '@/compositions/useWallets';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '@/config/walletType';
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';
import AddressAlreadyAdded from '@/components/Modals/AddressAlreadyAdded';

import { i18n } from '@/plugins/i18n';
import redirectToWallet from '../../router/helpers/redirectToWallet';
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
      redirectToNewWallet,
      newWallets,
      showAlreadyAddedModal,
    } = useCreateWallets();

    store.dispatch('metamask/connectToMetamask');

    setTimeout(() => {
      if (showLoader.value) {
        showLoader.value = false;
        router.push('/add-address/import-existing-address/metamask-keplr');
      }
    }, 7000);

    const metamaskConnector = computed(() => store.getters['metamask/metamaskConnector']);
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
      if (!['bsc', 'eth'].includes(metamaskConnector.value.network)) {
        notify({
          type: 'warning',
          text: t('metamask.changeNetwork'),
        });
      }
    };

    checkAccessToMetamask();

    watch(() => metamaskConnector.value.accounts, () => {
      const { network, accounts } = metamaskConnector.value;

      if (accounts && accounts[0]) {
        showLoader.value = false;
      }
      if (['eth', 'bsc'].includes(network)) {
        import(`@/assets/icons/networks/${network}.svg`).then((val) => {
          currentIcon.value = markRaw(val.default);
        });
      } else {
        currentIcon.value = '';
      }
    });

    watch(() => metamaskConnector.value.network, (newV) => {
      const network = newV;

      if (['eth', 'bsc'].includes(network)) {
        import(`@/assets/icons/networks/${network}.svg`).then((val) => {
          currentIcon.value = markRaw(val.default);
        });
      } else {
        currentIcon.value = '';
      }
    });

    const router = useRouter();

    const modalCloseHandler = () => {
      redirectToNewWallet();
      existAddressInMetamask.value = false;
      showModal.value = false;
    };

    const alreadyAddedCloseHandler = () => {
      redirectToWallet({
        wallet: existAddressInMetamask.value,
        root: true,
      });

      showModal.value = false;
      showAlreadyAddedModal.value = false;
      existAddressInMetamask.value = false;
    };

    const importWallet = async () => {
      const { network, accounts } = metamaskConnector.value;

      showLoader.value = true;

      if (!['bsc', 'eth'].includes(metamaskConnector.value.network)) {
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
        wallet => wallet.address.toLowerCase() === accounts[0].toLowerCase() && wallet.net === network,
      );

      if (!existAddressInMetamask.value) {
        setAddress(accounts[0]);
        setNets([network]);
        await createWallets(WALLET_TYPES.PUBLIC_KEY);
        // eslint-disable-next-line prefer-destructuring
        existAddressInMetamask.value = newWallets.value[0];
      } else {
        showAlreadyAddedModal.value = true;
      }

      showLoader.value = false;
      importModal.value = false;
      showModal.value = true;
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
      showAlreadyAddedModal,
      modalCloseHandler,
      importWallet,
      cancel,
      alreadyAddedCloseHandler,
    };
  },
};
</script>

<style lang="scss" scoped>
.import-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__address {
    margin-top: 10px;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    margin-top: 35px;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    text-align: center;
    padding: 13px 0;

    & svg {
      fill: white;
      height: 24px;
    }

    background: $mid-blue;
  }
}
</style>
