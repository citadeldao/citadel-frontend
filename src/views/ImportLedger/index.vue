<template>
  <div class="import-ledger">
    <Header :current-step="currentStep" :steps="steps" />
    <div class="import-ledger__section">
      <!-- <Stepper :steps="steps" /> -->
      <ImportHardwareWallet v-if="currentStep === 2" @setNet="setNet" />
      <ConnectDevice v-if="currentStep === 3" :net="net" />
      <ChooseDerivationPath
        v-if="currentStep === 4"
        :net="net"
        @selectWallet="addWallet"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import Header from '../AddAddress/components/Header';
import ImportHardwareWallet from './components/ImportHardwareWallet';
import ConnectDevice from './components/ConnectDevice';
import ChooseDerivationPath from './components/ChooseDerivationPath';
import useCurrentStep from '@/compositions/useCurrentStep';
import { steps as ledgerSteps } from '@/static/importLedger';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ImportLedger',
  components: {
    Header,
    ImportHardwareWallet,
    ConnectDevice,
    ChooseDerivationPath,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const { currentStep, steps } = useCurrentStep(2, ledgerSteps);
    const net = ref('');
    const showModal = ref(false);
    const showLoader = ref(false);
    const router = useRouter();
    const setNet = (netName) => {
      net.value = netName;
    };
    const { newWallets, redirectToNewWallet } = useCreateWallets();
    onMounted(() => {
      store.dispatch('newWallets/setCatPageProps', {
        inputTypeIcon: 'hardware-dot',
        walletTypePlaceholder: t('catPage.placeholderHardware'),
      });
    });
    const modalCloseHandler = () => {
      redirectToNewWallet();
      showModal.value = false;
    };
    const modalClickHandler = () => modalCloseHandler();

    const addWallet = async (wallet) => {
      showModal.value = true;
      showLoader.value = true;
      const { newWalletInstance, error } = await store.dispatch(
        'crypto/addHardwareWalletToAccount',
        { wallet }
      );

      if (!error) {
        newWallets.value = [newWalletInstance];
        const newWallet = newWalletInstance;
        await store.dispatch('wallets/pushWallets', { wallets: [newWallet] });
        // await store.dispatch('wallets/getNewWallets','lazy');
        // store.dispatch('wallets/getNewWallets','detail');
      } else {
        router.push({ name: 'AddAddress' });
      }

      showLoader.value = false;
    };

    return {
      steps,
      currentStep,
      showModal,
      showLoader,
      modalCloseHandler,
      modalClickHandler,
      setNet,
      newWallets,
      net,
      addWallet,
    };
  },
};
</script>
<style lang="scss" scoped>
.import-ledger {
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
