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
        <CreatePassword
          @createPassword="setPassword"
          @updateShowImportModal="showImportModal = true"
        />
      </keep-alive>
      <EnterOneSeed
        v-if="currentStep === 3"
        @confirmMnemonic="setMnemonic"
        :importedMnemonic="importedMnemonic"
      />
      <SelectNetworks v-if="currentStep === 4" @selectNets="finalStep" />
    </div>
  </div>
  <teleport v-if="showImportModal" to="body">
    <Modal>
      <ModalContent
        v-click-away="modalCloseHandler"
        :title="$t('steps.importFileExp')"
        :desc="$t('steps.importFile.step2HeaderInfo')"
        type="action"
        width="600px"
        :disabled="false"
        @close="modalCloseHandler"
      >
        <ImportModalContent @passwordConfirmed="importFileHandler" />
      </ModalContent>
    </Modal>
  </teleport>
</template>

<script>
import ImportModalContent from './components/ImportModalContent.vue';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import Header from '../AddAddress/components/Header';
import EnterOneSeed from './components/EnterOneSeed';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import useCurrentStep from '@/compositions/useCurrentStep';
import SelectNetworks from '@/components/UI/SelectNetworks';
import useCreateWallets from '@/compositions/useCreateWallets';
import { steps as restoreOneSeedSteps } from '@/static/restoreOneSeed';
import { useStore } from 'vuex';
import { ref } from '@vue/reactivity';
export default {
  name: 'RestoreOneSeed',
  components: {
    EnterOneSeed,
    Header,
    EnterPassword,
    CreatePassword,
    SelectNetworks,
    Modal,
    ModalContent,
    ImportModalContent,
  },
  setup() {
    const importFileHandler = ({ password, mnemonic }) => {
      importedMnemonic.value = mnemonic;
      setCurrentStep(3);
      setPassword(password);
      showImportModal.value = false;
    };
    const importedMnemonic = ref('');
    const showImportModal = ref(false);
    const { currentStep, steps, setCurrentStep } = useCurrentStep(
      2,
      restoreOneSeedSteps
    );

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
    const finalStep = async (nets) => {
      store.commit('newWallets/setLoader', true);
      setNets(nets);
      setType('oneSeed');
      const success = createWallets();
      success.then(async () => {
        !isPasswordHash.value && savePassword();
        !isUserMnemonic.value && (await saveMnemonic());
        await redirectToNewWallet();
        store.commit('newWallets/setNewWalletsList', newWallets.value);
        store.commit('newWallets/setLoader', false);
        store.commit('newWallets/setModal', true);
      });
    };

    isUserMnemonic.value && redirectToNewWallet();

    const modalCloseHandler = () => {
      showImportModal.value = false;
    };

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
      showImportModal,
      modalCloseHandler,
      importFileHandler,
      importedMnemonic,
    };
  },
};
</script>
<style lang="scss" scoped>
.restore-one-seed {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 50px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  padding: 0 40px 43px;
  flex-grow: 1;
  height: 100%;
  margin-bottom: 40px;

  &__section {
    display: flex;
    flex-grow: 1;
  }
}

body.dark {
  .restore-one-seed {
    background: $dark-panel-bg;
  }
}
</style>
