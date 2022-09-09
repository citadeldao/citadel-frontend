<template>
  <div class="restore-one-seed">
    <Header :current-step="currentStep" :steps="steps" />
    <div class="restore-one-seed__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 2 && isPasswordHash"
        @passwordConfirmed="setPassword"
      />
      <keep-alive v-else-if="currentStep === 2">
        <CreatePassword @createPassword="setPassword" />
      </keep-alive>
      <EnterOneSeed v-if="currentStep === 3" @confirmMnemonic="setMnemonic" />
      <SelectNetworks v-if="currentStep === 4" @selectNets="finalStep" />
    </div>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import EnterOneSeed from './components/EnterOneSeed';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import useCurrentStep from '@/compositions/useCurrentStep';
import SelectNetworks from '@/components/UI/SelectNetworks';
import useCreateWallets from '@/compositions/useCreateWallets';
import { steps as restoreOneSeedSteps } from '@/static/restoreOneSeed';
import { useStore } from 'vuex';
export default {
  name: 'RestoreOneSeed',
  components: {
    EnterOneSeed,
    Header,
    EnterPassword,
    CreatePassword,
    SelectNetworks,
  },
  setup() {
    const { currentStep, steps } = useCurrentStep(2, restoreOneSeedSteps);

    const {
      showLoader,
      showModal,
      setPassword,
      setMnemonic,
      saveMnemonic,
      savePassword,
      setNets,
      setType,
      isPasswordHash,
      isUserMnemonic,
      createWallets,
      newWallets,
      redirectToNewWallet,
    } = useCreateWallets();
    const store = useStore();
    const finalStep = (nets) => {
      store.commit('newWallets/setLoader', true);
      setNets(nets);
      setType('oneSeed');
      const success = createWallets();
      success.then(async () => {
        !isPasswordHash.value && savePassword();
        !isUserMnemonic.value && saveMnemonic();
        await redirectToNewWallet();
        store.commit('newWallets/setNewWalletsList', newWallets.value);
        store.commit('newWallets/setLoader', false);
        store.commit('newWallets/setModal', true);
      });
    };

    isUserMnemonic.value && redirectToNewWallet();

    return {
      steps,
      currentStep,
      showModal,
      setPassword,
      setMnemonic,
      isPasswordHash,
      finalStep,
      newWallets,
      showLoader,
    };
  },
};
</script>
<style lang="scss" scoped>
.restore-one-seed {
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 44px;
  flex-grow: 1;
  height: 100%;
  @include lg {
    padding: 0 40px;
  }
  @include md {
    height: calc(100vh - 82px);
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 0 31px;
  }

  &__section {
    overflow: hidden;
    display: flex;
    flex-grow: 1;
  }
}
</style>
