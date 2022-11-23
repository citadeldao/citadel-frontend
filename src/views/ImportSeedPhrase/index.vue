<template>
  <div class="import-seed-phrase">
    <Header :current-step="currentStep" :steps="steps" />
    <div class="import-seed-phrase__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 2 && isPasswordHash"
        @passwordConfirmed="setPassword"
      />
      <keep-alive v-else-if="currentStep === 2">
        <CreatePassword @createPassword="setPassword" />
      </keep-alive>
      <AddressSpecifications v-if="currentStep === 3" @createOpts="setOpts" />
      <ChooseDerivationPath
        v-if="currentStep === 4"
        :wallet-opts="walletOpts"
        @selectWallet="finalStep"
      />
    </div>
  </div>
</template>

<script>
import ChooseDerivationPath from './components/ChooseDerivationPath';
import AddressSpecifications from './components/AddressSpecifications';
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import useCurrentStep from '@/compositions/useCurrentStep';
import { getSteps } from '@/static/importSeedPhrase';
import useCreateWallets from '@/compositions/useCreateWallets';
import useWallets from '@/compositions/useWallets';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import citadel from '@citadeldao/lib-citadel';
import { onMounted } from 'vue';
import notify from '@/plugins/notify';
import { useI18n } from 'vue-i18n';

export default {
  name: 'ImportSeedPhrase',
  components: {
    EnterPassword,
    CreatePassword,
    Header,
    AddressSpecifications,
    ChooseDerivationPath,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { t } = useI18n();

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

    const { currentStep, steps } = useCurrentStep(
      2,
      getSteps(isPasswordHash.value)
    );

    const { wallets } = useWallets();

    const setOpts = ({ net, mnemonic, passphrase }) => {
      setNets([net]);
      setMnemonic(mnemonic);
      setPassphrase(passphrase);
    };
    onMounted(() => {
      store.commit('newWallets/setCatPageProps', {
        dataQa: 'add-address__existing__seed-phrase',
      });
    });
    const finalStep = async (wallet) => {
      const hasWalletsFromNet = wallets.value.filter(
        (w) => w.net === wallet.net
      ).length;

      if (hasWalletsFromNet >= 20) {
        notify({
          type: 'warning',
          text: t('addAddress.addressLimits'),
        });
        return;
      }

      store.commit('newWallets/setLoader', true);
      await setImportedFromSeed();
      const { data, error } = await citadel.addCreatedWallet({
        ...wallet,
        ...wallet.config,
        type:
          walletOpts.mnemonic === (await userMnemonic(walletOpts.password)) ||
          !isUserMnemonic.value
            ? 'oneSeed'
            : 'privateKey',
        networkName: wallet.config.name,
      });

      if (!error) {
        !isPasswordHash.value && savePassword();
        !isUserMnemonic.value && (await saveMnemonic());
        const newInstance = await store.dispatch(
          'crypto/createNewWalletInstance',
          {
            walletOpts: {
              ...data,
              importedFromSeed: walletOpts.importedFromSeed,
              mnemonic: walletOpts.mnemonic,
              privateKeyEncoded: wallet.privateKeyEncoded,
            },
            password: walletOpts.password,
          }
        );
        newWallets.value = [newInstance];
        const newWallet = newInstance;
        await store.dispatch('wallets/pushWallets', { wallets: [newWallet] });
        await redirectToNewWallet();
        store.commit('newWallets/setNewWalletsList', newWallets.value);
        store.commit('newWallets/setLoader', false);
        store.commit('newWallets/setModal', true);
        // await store.dispatch('wallets/getNewWallets','lazy');
        // store.dispatch('wallets/getNewWallets','detail');
      } else {
        router.push({ name: 'AddAddress' });
      }

      store.commit('newWallets/setLoader', false);
    };

    return {
      steps,
      currentStep,
      setPassword,
      setDerivationPath,
      isPasswordHash,
      setOpts,
      newWallets,
      finalStep,
      walletOpts,
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
  height: 100%;

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
