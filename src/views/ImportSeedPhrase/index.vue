<template>
  <div class="import-seed-phrase">
    <Header
      :current-step="currentStep"
      :steps="steps"
    />
    <div class="import-seed-phrase__section">
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
        @createOpts="setOpts"
      />
      <ChooseDerivationPath
        v-if="currentStep === 4"
        :wallet-opts="walletOpts"
        @selectWallet="finalStep"
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
          <CatPage
            v-else
            v-click-away="modalClickHandler"
            :data="newWallets"
            data-qa="add-address__existing__seed-phrase"
            @close="modalCloseHandler"
            @buttonClick="modalClickHandler"
          />
        </Modal>
      </transition>
    </teleport>
  </div>
</template>

<script>
import ChooseDerivationPath from './components/ChooseDerivationPath';
import AddressSpecifications from './components/AddressSpecifications';
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import CatPage from '@/components/CatPage';
import Modal from '@/components/Modal';
import useCurrentStep from '@/compositions/useCurrentStep';
import { steps as seedPhraseSteps } from '@/static/importSeedPhrase';
import useCreateWallets from '@/compositions/useCreateWallets';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import citadel from '@citadeldao/lib-citadel';

export default {
  name: 'ImportSeedPhrase',
  components: {
    CatPage,
    Modal,
    EnterPassword,
    CreatePassword,
    Header,
    AddressSpecifications,
    ChooseDerivationPath,
  },
  setup() {
    const store = useStore();
    const showModal = ref(false);
    const showLoader = ref(false);
    const router = useRouter();
    const { currentStep, steps } = useCurrentStep(2, seedPhraseSteps);

    const {
      setPassword,
      setMnemonic,
      setNets,
      setPassphrase,
      saveMnemonic,
      savePassword,
      newWallets,
      isUserMnemonic,
      userMnemonic,
      setDerivationPath,
      isPasswordHash,
      walletOpts,
      setImportedFromSeed,
      redirectToNewWallet,
    } = useCreateWallets();

    const setOpts = ({ net, mnemonic, passphrase }) => {
      setNets([net]);
      setMnemonic(mnemonic);
      setPassphrase(passphrase);
    };

    const modalCloseHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };
    const modalClickHandler = () => {
      showModal.value = false;
      redirectToNewWallet();
    };

    const finalStep = async ( wallet ) => {
      showModal.value = true;
      showLoader.value = true;
      setImportedFromSeed();
      const { data, error } = await  await citadel.addCreatedWallet({
        ...wallet,
        ...wallet.config,
        type:  walletOpts.mnemonic === userMnemonic(walletOpts.password) || !isUserMnemonic.value ?
          'oneSeed' : 'privateKey',
        networkName: wallet.config.name,
      });
      if(!error){
        !isPasswordHash.value && savePassword();
        !isUserMnemonic.value && saveMnemonic();
        const newInstance = await store.dispatch('crypto/createNewWalletInstance',
          { walletOpts: {
            ...data,
            importedFromSeed: walletOpts.importedFromSeed,
            mnemonicEncoded: wallet.mnemonicEncoded,
            privateKeyEncoded: wallet.privateKeyEncoded,
          },
          password: walletOpts.password });
        newWallets.value = [newInstance];
        const newWallet = newInstance;
        await store.dispatch('wallets/pushWallets', { wallets: [newWallet] } );
        // await store.dispatch('wallets/getNewWallets','lazy');
        // store.dispatch('wallets/getNewWallets','detail');
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
      modalClickHandler,
      setPassword,
      setDerivationPath,
      isPasswordHash,
      setOpts,
      newWallets,
      finalStep,
      walletOpts,
      showLoader,
    };
  },
};
</script>
<style lang="scss" scoped>
.import-seed-phrase {
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
