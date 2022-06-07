<template>
  <div class="import-trezor">
    <Header
      :current-step="currentStep"
      :steps="steps"
    />
    <div class="import-trezor__section">
      <!-- <Stepper :steps="steps" /> -->
      <ImportHardwareWallet
        v-if="currentStep === 2"
        @setNet="setNet"
      />
      <ConnectDevice
        v-if="currentStep === 3"
        :net="net"
      />
      <ChooseDerivationPath
        v-if="currentStep === 4"
        :net="net"
        @selectWallet="addWallet"
      />
    </div>
    <teleport
      v-if="showModal"
      to="body"
    >
      <Modal>
        <img
          v-if="showLoader"
          src="@/assets/gif/loader.gif"
          alt=""
        >
        <CatPage
          v-else
          v-click-away="modalClickHandler"
          :data="newWallets"
          :wallet-type-placeholder="$t('catPage.placeholderHardware')"
          input-type-icon="hardware-dot"
          @close="modalCloseHandler"
          @buttonClick="modalCloseHandler"
        />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import ImportHardwareWallet from './components/ImportHardwareWallet';
import ConnectDevice from './components/ConnectDevice';
import ChooseDerivationPath from './components/ChooseDerivationPath';
import CatPage from '@/components/CatPage';
import useCurrentStep from '@/compositions/useCurrentStep';
import Modal from '@/components/Modal';
import { provide, ref } from 'vue';
import { steps as trezorSteps } from '@/static/importTrezor';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ImportTrezor',
  components: {
    CatPage,
    Modal,
    Header,
    ImportHardwareWallet,
    ConnectDevice,
    ChooseDerivationPath,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    // used when user cancels trezor connection
    const isRetry = ref(false);
    const setIsRetry = (val) => (isRetry.value = val); // false || true
    provide('isRetry', isRetry);
    provide('setIsRetry', setIsRetry);

    const { currentStep, steps } = useCurrentStep(2, trezorSteps);

    const showModal = ref(false);
    const showLoader = ref(false);

    const net = ref('');
    const setNet = (n) => {
      net.value = n;
    };
    const { newWallets, redirectToNewWallet } = useCreateWallets();
    const modalCloseHandler = () => {
      redirectToNewWallet();
      showModal.value = false;
    };
    const addWallet = async (wallet) => {
      showModal.value = true;
      showLoader.value = true;

      const { newWalletInstance, error } = await store.dispatch('crypto/addHardwareWalletToAccount', { wallet });
      if(!error){
        newWallets.value = [newWalletInstance];
        const newWallet = newWalletInstance;

        await store.dispatch('wallets/pushWallets', { wallets: [newWallet] });
        await store.dispatch('wallets/getNewWallets','lazy');
        store.dispatch('wallets/getNewWallets','detail');
      }else{
        router.push({ name: 'AddAddress' });
      }
      showLoader.value = false;
    };

    return {
      steps,
      currentStep,
      showModal,
      modalCloseHandler,
      setNet,
      net,
      addWallet,
      showLoader,
      newWallets,
    };
  },
};
</script>
<style lang="scss" scoped>
.import-trezor {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px 40px;
  flex-grow: 1;
  margin-bottom: 8px;

  @include lg {
    padding: 0 40px 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 0 31px 40px;
  }

  &__section {
    display: flex;
    flex-grow: 1;
  }
}
</style>
