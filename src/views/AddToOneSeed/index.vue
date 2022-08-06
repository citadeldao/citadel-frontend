<template>
  <div class="add-to-one-seed">
    <Header :current-step="currentStep" :steps="steps" />
    <div v-if="isUserMnemonic" class="add-to-one-seed__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 1"
        @passwordConfirmed="setPassword"
      />
      <SelectNetworks v-if="currentStep === 2" @selectNets="finalStep" />
    </div>
    <div v-else class="add-to-one-seed__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 1 && isPasswordHash"
        @passwordConfirmed="setPassword"
      />
      <keep-alive v-else-if="currentStep === 1">
        <CreatePassword @createPassword="setPassword" />
      </keep-alive>
      <CreateOneSeed v-if="currentStep === 2" @createMnemonic="setMnemonic" />
      <ConfirmOneSeed
        v-if="currentStep === 3"
        :mnemonic="walletOpts.mnemonic"
      />
      <DownloadOneSeed v-if="currentStep === 4" />
      <SelectNetworks v-if="currentStep === 5" @selectNets="finalStep" />
    </div>
    <teleport to="body">
      <transition name="fade">
        <Modal v-if="showModal">
          <img v-if="showLoader" src="@/assets/gif/loader.gif" alt="" />
          <CatPage
            v-else
            v-click-away="modalClickHandler"
            :data="newWallets"
            data-qa="add-address__one-seed"
            @close="modalCloseHandler"
            @buttonClick="modalClickHandler"
          />
        </Modal>
      </transition>
    </teleport>
  </div>
</template>

<script>
import ConfirmOneSeed from './components/ConfirmOneSeed';
import CreateOneSeed from './components/CreateOneSeed';
import CatPage from '@/components/CatPage';
import Modal from '@/components/Modal';
import DownloadOneSeed from './components/DownloadOneSeed';
import SelectNetworks from '@/components/UI/SelectNetworks';
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import useCurrentStep from '@/compositions/useCurrentStep';
import {
  steps as stepsOneSeed,
  steps1 as stepsOneSeed1,
} from '@/static/addToOneSeed';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '../../config/walletType';

export default {
  name: 'AddToOneSeed',
  components: {
    Header,
    EnterPassword,
    CreatePassword,
    SelectNetworks,
    Modal,
    CatPage,
    CreateOneSeed,
    ConfirmOneSeed,
    DownloadOneSeed,
  },
  setup() {
    const {
      showLoader,
      showModal,
      setPassword,
      setMnemonic,
      savePassword,
      saveMnemonic,
      setNets,
      setType,
      createWallets,
      walletOpts,
      newWallets,
      isUserMnemonic,
      isPasswordHash,
      redirectToNewWallet,
    } = useCreateWallets();

    const finalStep = (nets) => {
      isUserMnemonic.value && setMnemonic();
      setNets(nets);
      setType('oneSeed');
      createWallets(WALLET_TYPES.ONE_SEED).then((success) => {
        if (success) {
          !isUserMnemonic.value && saveMnemonic();
          !isPasswordHash.value && savePassword();
        }
      });
    };

    const { currentStep, steps } = useCurrentStep(
      1,
      isUserMnemonic.value ? stepsOneSeed : stepsOneSeed1
    );

    const modalCloseHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };
    const modalClickHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };

    return {
      steps,
      currentStep,
      showModal,
      isUserMnemonic,
      isPasswordHash,
      modalCloseHandler,
      modalClickHandler,
      walletOpts,
      setPassword,
      setMnemonic,
      newWallets,
      finalStep,
      showLoader,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-to-one-seed {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  flex-grow: 1;
  padding: 0 44px;
  height: calc(100% + 50px); // calc(100vh - 114px);
  margin-bottom: 8px;

  @include lg {
    padding: 0 40px;
    height: calc(100% + 50px);
  }
  @include md {
    padding: 0 31px;
    height: calc(100vh - 82px);
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }
  &__section {
    overflow: hidden;
    display: flex;
    flex-grow: 1;
    justify-content: center;
  }
}
</style>
