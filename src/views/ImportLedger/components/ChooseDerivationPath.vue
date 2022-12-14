<template>
  <div class="choose-derivation-path">
    <div v-if="pathOptions.length > 1" class="autocomplete-wrap">
      <div class="autocomplete">
        <Select
          v-model="currentPathDerivation"
          :label="$t('importCustomPath.labelSelect')"
          icon="curve-arrow"
          :options="pathOptions"
          value-key="key"
          data-qa="settings__language-field"
          @change="createWalletsWithTemplatePath"
        />
      </div>
    </div>
    <div v-if="wallets.length" class="choose-derivation-path__card-wrapper">
      <DerivationPathCard
        v-for="(wallet, key) in wallets"
        :key="key"
        :wallet="wallet.walletInstance"
        :exist="wallet.alreadyExist"
        :checked="checked(wallet.walletInstance)"
        @check="addSingleItem"
      />
      <div
        class="add-derivation__card"
        @click="generateNewPath"
        v-if="numberOfPaths < maxPaths"
      >
        <seedPhraseIcon class="initial-icon" />

        {{ $t('anotherAddress') }}
      </div>
    </div>
    <div v-if="customWallet" class="choose-derivation-path__custom">
      <span>Custom</span>
      <DerivationPathCard
        :wallet="customWallet.walletInstance"
        type="custom"
        :exist="customWallet.alreadyExist"
        :checked="checked(customWallet.walletInstance)"
        :waiting="isCustomLoading"
        @changePath="setCustomWallet"
        @check="addSingleItem"
      />
    </div>
    <PrimaryButton
      v-if="customWallet && wallets.length"
      :disabled="disabled"
      @click="clickHandler"
    >
      {{ $t('import') }}
    </PrimaryButton>
    <teleport v-if="showLoader" to="body">
      <Modal>
        <img src="@/assets/gif/loader.gif" alt="" />
      </Modal>
    </teleport>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import DerivationPathCard from '@/components/DerivationPathCard';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import Modal from '@/components/Modal';
import { WALLET_TYPES } from '@/config/walletType';
import Select from '@/components/UI/Select';
import CryptoCoin from '@/models/CryptoCoin';
import notify from '@/plugins/notify';
import seedPhraseIcon from '@/assets/icons/addAddressV2/seedphrase-type.svg';

export default {
  name: 'ChooseDerivationPath',
  components: {
    PrimaryButton,
    DerivationPathCard,
    Modal,
    Select,
    seedPhraseIcon,
  },
  props: {
    net: {
      type: String,
    },
  },
  emits: ['selectWallet'],
  setup(props, { emit }) {
    const showModal = ref(true);
    const showLoader = ref(true);
    const { checked, addSingleItem, checkedItems } = useCheckItem();
    const store = useStore();

    const numberOfPaths = ref(5);
    const wallets = ref([]);
    const maxPaths = ref(20);
    const pathOptions = ref(
      props.net === 'evmos'
        ? [
            CryptoCoin.getDerivationPathTemplates(
              props.net,
              WALLET_TYPES.LEDGER
            )[0],
          ]
        : CryptoCoin.getDerivationPathTemplates(props.net, WALLET_TYPES.LEDGER)
    );

    const currentPathDerivation = ref(
      (pathOptions.value && pathOptions.value[0].key) || ''
    );

    const createWalletsWithTemplatePath = async (templatePath) => {
      showModal.value = true;
      showLoader.value = true;
      wallets.value = [];

      let currentPath = 0;

      while (currentPath < numberOfPaths.value) {
        const wallet = await store.dispatch('crypto/createLedgerWallet', {
          derivationPath: templatePath.replace('N', currentPath),
          net: props.net,
        });
        wallets.value.push(wallet);
        const isLastIteration = currentPath === numberOfPaths.value - 1;

        if (isLastIteration) {
          await setCustomWallet();
          showModal.value = false;
          showLoader.value = false;
        }

        currentPath++;
      }
    };

    const createWallets = async () => {
      let currentPath = 0;

      while (currentPath < numberOfPaths.value) {
        const wallet = await store.dispatch('crypto/createLedgerWallet', {
          pathIndex: currentPath,
          net: props.net,
        });
        wallets.value.push(wallet);
        const isLastIteration = currentPath === numberOfPaths.value - 1;

        if (isLastIteration) {
          await setCustomWallet();
          showModal.value = false;
          showLoader.value = false;
        }

        currentPath++;
      }
    };

    // when coins has walletTemplatesDerivation
    if (pathOptions.value.length > 1) {
      createWalletsWithTemplatePath(currentPathDerivation.value);
    } else {
      createWallets(WALLET_TYPES.LEDGER);
    }

    const isCustomLoading = ref(false);
    const customWallet = ref(false);
    const setCustomWallet = async (customPath) => {
      isCustomLoading.value = true;

      const wallet = await store.dispatch('crypto/createLedgerWallet', {
        derivationPath: customPath,
        net: props.net,
      });

      if (wallet.walletInstance) {
        customWallet.value = wallet;
        addSingleItem(wallet.walletInstance);
        if (!customPath) {
          addSingleItem(wallets.value[0].walletInstance);
        }
        isCustomLoading.value = false;
      } else {
        notify({
          type: 'warning',
          text: wallet.error,
        });
        isCustomLoading.value = false;
      }
    };

    const clickHandler = () => {
      emit('selectWallet', checkedItems.value[0]);
    };

    const disabled = computed(() => {
      const isChecked = checkedItems.value?.length;
      const existingWallet = store.getters['wallets/walletByAddress'](
        checkedItems.value[0]
      );
      const isExist =
        !!existingWallet && existingWallet.type !== WALLET_TYPES.PUBLIC_KEY;

      return !isChecked || isExist;
    });

    const generateNewWalletLoader = ref(false);

    const generateNewPath = async () => {
      if (generateNewWalletLoader.value) return;

      if (numberOfPaths.value < maxPaths.value) {
        generateNewWalletLoader.value = true;
        numberOfPaths.value++;

        // createWalletsWithTemplatePath(currentPathDerivation.value); // default
        const wallet = await store.dispatch('crypto/createLedgerWallet', {
          derivationPath: currentPathDerivation.value.replace(
            'N',
            numberOfPaths.value - 1
          ),
          net: props.net,
        });
        wallets.value.push(wallet);
        generateNewWalletLoader.value = false;
      }
    };

    return {
      clickHandler,
      addSingleItem,
      checked,
      wallets,
      setCustomWallet,
      customWallet,
      isCustomLoading,
      showModal,
      showLoader,
      checkedItems,
      disabled,

      pathOptions,
      currentPathDerivation,
      createWalletsWithTemplatePath,
      generateNewPath,
      maxPaths,
      numberOfPaths,
    };
  },
};
</script>

<style lang="scss" scoped>
.choose-derivation-path {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 31px;

  .autocomplete-wrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 20px;
  }

  .autocomplete {
    width: 430px;
    height: 68px;
    position: relative;
    @include md {
      width: 483px;
    }
  }

  @include lg {
    padding-top: 32px;
    padding-left: 45px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 24px;
  }

  &__card-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 32px;
    @include lg {
      margin-bottom: 24px;
      gap: 8px;
    }
    @include md {
      margin-bottom: 16px;
      gap: 8px;
    }
  }

  &__custom {
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;
    width: 100%;
    @include md {
      margin-bottom: 24px;
    }

    & span {
      font-size: 20px;
      line-height: 24px;
      font-family: 'Panton_Bold';
      margin-bottom: 27px;
      @include lg {
        margin-bottom: 11px;
      }
      @include md {
        margin-bottom: 11px;
      }
    }
  }

  .add-derivation__card {
    width: 288px;
    height: 150px;
    border: 1px solid #c3ceeb;
    border-radius: 8px;
    padding: 24px 24px 21px 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    text-align: center;
    color: #6b93c0;
    @include lg {
      width: 277px;
      padding: 16px 16px 13px 16px;
    }
    @include md {
      width: 100%;
      padding: 16px;
      height: 64px;
      flex-direction: row;
    }
    svg {
      width: 40px;
      fill: $too-ligth-blue;
      &:hover {
        fill: $dark-blue;
      }
    }
  }
}
</style>
