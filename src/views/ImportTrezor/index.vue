<template>
  <div class="import-trezor">
    <Header :current-step="currentStep" :steps="steps" />
    <div class="import-trezor__section">
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
import Header from '../AddAddress/components/Header';
import ImportHardwareWallet from './components/ImportHardwareWallet';
import ConnectDevice from './components/ConnectDevice';
import ChooseDerivationPath from './components/ChooseDerivationPath';
import useCurrentStep from '@/compositions/useCurrentStep';
import { provide, ref, onMounted } from 'vue';
import { steps as trezorSteps } from '@/static/importTrezor';
import useCreateWallets from '@/compositions/useCreateWallets';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { INPUT_TYPE_ICON } from '@/config/newWallets';

export default {
  name: 'ImportTrezor',
  components: {
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

    const net = ref('');
    const setNet = (n) => {
      net.value = n;
    };
    const { newWallets } = useCreateWallets();
    const { t } = useI18n();
    onMounted(() => {
      store.dispatch('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.HARDWARE,
        walletTypePlaceholder: t('catPage.placeholderHardware'),
      });
    });
    const addWallet = async (wallet) => {
      store.dispatch('newWallets/showLoader');

      const { newWalletInstance, error } = await store.dispatch(
        'crypto/addHardwareWalletToAccount',
        { wallet }
      );

      if (!error) {
        newWallets.value = [newWalletInstance];
        const newWallet = newWalletInstance;
        store.dispatch('newWallets/setNewWalletsList', newWallets.value);
        store.dispatch('newWallets/showModal');
        await store.dispatch('wallets/pushWallets', { wallets: [newWallet] });
        // await store.dispatch('wallets/getNewWallets','lazy');
        // store.dispatch('wallets/getNewWallets','detail');
      } else {
        router.push({ name: 'AddAddress' });
      }

      store.dispatch('newWallets/hideLoader');
    };

    return {
      steps,
      currentStep,
      setNet,
      net,
      addWallet,
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
