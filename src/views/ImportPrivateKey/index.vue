<template>
  <div class="import-private-key">
    <Header
      :current-step="currentStep"
      :steps="steps"
    />
    <div class="import-private-key__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 2 && isPasswordHash"
        @passwordConfirmed="setPassword"
      />
      <keep-alive v-else-if="currentStep === 2">
        <CreatePassword @createPassword="setPassword" />
      </keep-alive>
      <AddressSpecifications
        v-if="currentStep === 3"
        @setSpecifications="finalStep"
      />
    </div>
    <teleport to="body">
      <transition name="fade">
        <Modal v-if="showModal">
          <img
            v-if="showLoader"
            src="@/assets/gif/loader.gif"
            alt=""
          >
          <AddressAlreadyAdded
            v-else-if="showAlreadyAddedModal"
            v-click-away="alreadyAddedCloseHandler"
            @close="alreadyAddedCloseHandler"
            @buttonClick="alreadyAddedClickHandler"
          />
          <CatPage
            v-else
            v-click-away="successModalCloseHandler"
            :data="newWallets"
            :wallet-type-placeholder="$t('catPage.placeholderPrivate')"
            input-type-icon="private-dot"
            data-qa="add-address__existing__private-key"
            @close="successModalCloseHandler"
            @buttonClick="successModalClickHandler"
          />
        </Modal>
      </transition>
    </teleport>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import AddressSpecifications from './components/AddressSpecifications';
import CatPage from '@/components/CatPage';
import Modal from '@/components/Modal';
import AddressAlreadyAdded from '@/components/Modals/AddressAlreadyAdded';
import useCurrentStep from '@/compositions/useCurrentStep';
import { getSteps } from '@/static/importPrivateKey';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '../../config/walletType';

export default {
  name: 'ImportPrivateKey',
  components: {
    CatPage,
    Modal,
    EnterPassword,
    CreatePassword,
    Header,
    AddressSpecifications,
    AddressAlreadyAdded,
  },
  setup() {
    const {
      showLoader,
      showModal,
      setPassword,
      setPrivateKey,
      setNets,
      setType,
      createWallets,
      newWallets,
      isPasswordHash,
      savePassword,
      redirectToNewWallet,
      showAlreadyAddedModal,
      setAccount,
    } = useCreateWallets();

    const { currentStep, steps } = useCurrentStep(2, getSteps(isPasswordHash.value));

    const finalStep = ({ net, privateKey, account }) => {
      setPrivateKey(privateKey);
      setNets([net]);
      setType('privateKey');
      account && setAccount(account);
      const success = createWallets(WALLET_TYPES.PRIVATE_KEY);
      success.then(() => {
        !isPasswordHash.value && savePassword();
      });
    };

    const successModalCloseHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };
    const successModalClickHandler = successModalCloseHandler;

    const alreadyAddedCloseHandler = () => {
      showAlreadyAddedModal.value = false;
      showModal.value = false;
      redirectToNewWallet();
    };
    const alreadyAddedClickHandler = alreadyAddedCloseHandler;

    return {
      steps,
      currentStep,
      setPassword,
      setPrivateKey,
      isPasswordHash,
      showModal,
      newWallets,
      finalStep,
      successModalClickHandler,
      successModalCloseHandler,
      alreadyAddedClickHandler,
      alreadyAddedCloseHandler,
      showLoader,
      showAlreadyAddedModal,
    };
  },
};
</script>
<style lang="scss" scoped>
.import-private-key {
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
