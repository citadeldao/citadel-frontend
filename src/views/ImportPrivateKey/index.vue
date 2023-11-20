<template>
  <div class="import-private-key">
    <Header :current-step="currentStep" :steps="steps" />
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
        :invalid-private-key="invalidPrivateKey"
        @setSpecifications="finalStep"
      />
    </div>
  </div>
</template>

<script>
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import AddressSpecifications from './components/AddressSpecifications';
import useCurrentStep from '@/compositions/useCurrentStep';
import { getSteps } from '@/static/importPrivateKey';
import useCreateWallets from '@/compositions/useCreateWallets';
import useWallets from '@/compositions/useWallets';
import { WALLET_TYPES } from '../../config/walletType';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { INPUT_TYPE_ICON } from '@/config/newWallets';
import notify from '@/plugins/notify';
import { validatePrivateKey } from '@/helpers/validatePrivateKeys';

export default {
  name: 'ImportPrivateKey',
  components: {
    EnterPassword,
    CreatePassword,
    Header,
    AddressSpecifications,
  },
  setup() {
    const {
      setPassword,
      setPrivateKey,
      setNets,
      setType,
      createWallets,
      newWallets,
      isPasswordHash,
      savePassword,
      showAlreadyAddedModal,
      setAccount,
      redirectToNewWallet,
    } = useCreateWallets();
    const { currentStep, steps } = useCurrentStep(
      2,
      getSteps(isPasswordHash.value)
    );
    const { wallets } = useWallets();
    const { t } = useI18n();
    const store = useStore();
    const invalidPrivateKey = ref(false);

    onMounted(() => {
      store.commit('newWallets/setCatPageProps', {
        inputTypeIcon: INPUT_TYPE_ICON.PRIVATE,
        walletTypePlaceholder: t('catPage.placeholderPrivate'),
        dataQa: 'add-address__existing__private-key',
      });
    });
    const finalStep = ({ net, privateKey, account }) => {
      const hasWalletsFromNet = wallets.value.filter(
        (w) => w.net === net
      ).length;

      if (hasWalletsFromNet >= 20) {
        notify({
          type: 'warning',
          text: t('addAddress.addressLimits'),
        });
        return;
      }

      invalidPrivateKey.value = false;
      if (!validatePrivateKey(net, privateKey)) {
        invalidPrivateKey.value = true;
        return;
      }

      store.commit('newWallets/setLoader', true);
      setPrivateKey(privateKey);
      setNets([net]);
      setType('privateKey');
      account && setAccount(account);
      const success = createWallets(WALLET_TYPES.PRIVATE_KEY);
      success.then(async (e) => {
        if (e) {
          !isPasswordHash.value && savePassword();
          await redirectToNewWallet();
          store.commit('newWallets/setNewWalletsList', newWallets.value);
          store.commit('newWallets/setModal', true);
          store.commit('newWallets/setLoader', false);
        } else {
          store.commit('newWallets/setLoader', false);
        }
      });
    };

    return {
      steps,
      currentStep,
      setPassword,
      setPrivateKey,
      isPasswordHash,
      newWallets,
      finalStep,
      showAlreadyAddedModal,
      invalidPrivateKey,
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

body.dark {
  .import-private-key {
    background: $dark-panel-bg;
  }
}
</style>
