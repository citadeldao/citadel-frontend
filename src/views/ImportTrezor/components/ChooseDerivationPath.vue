<template>
  <div class="choose-derivation-path">
    <div
      v-if="customWallet"
      class="choose-derivation-path__custom"
    >
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
      v-if="customWallet"
      :disabled="disabled"
      @click="confirm"
    >
      {{ $t('import') }}
    </PrimaryButton>
    <teleport
      v-if="showLoader"
      to="body"
    >
      <Modal>
        <img
          src="@/assets/gif/loader.gif"
          alt=""
        >
      </Modal>
    </teleport>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import DerivationPathCard from '@/components/DerivationPathCard';
import useCheckItem from '@/compositions/useCheckItem';
import { useStore } from 'vuex';
import { ref, computed, inject } from 'vue';
import Modal from '@/components/Modal';
import { WALLET_TYPES } from '@/config/walletType';

export default {
  name: 'ChooseDerivationPath',
  components: {
    PrimaryButton,
    DerivationPathCard,
    Modal,
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

    const {
      checked,
      addSingleItem,
      checkedItems,
    } = useCheckItem();
    const store = useStore();

    const isCustomLoading = ref(false);
    const customWallet = ref(false);
    const previouseStep = inject('previousStep');
    const setIsRetry = inject('setIsRetry');

    const setCustomWallet = async (customPath) => {
      try {
        isCustomLoading.value = true;
        const wallet = await store.dispatch('crypto/createTrezorWallet', {
          derivationPath: customPath,
          net: props.net,
        });

        if (!wallet) {
          throw 'Could not create Trezor wallet';
        }

        if (wallet.error) {
          throw wallet.error;
        }

        customWallet.value = wallet;
        addSingleItem(wallet.walletInstance);
        isCustomLoading.value = false;
        showLoader.value = false;
      } catch (err) {
        console.error(err);
        customWallet.value = false;
        isCustomLoading.value = false;
        showLoader.value = false;
        setIsRetry(true);
        previouseStep();
      }
    };
    setCustomWallet();

    const confirm = () => {
      emit('selectWallet', checkedItems.value[0]);
    };

    const disabled = computed(() => {
      const isChecked = checkedItems.value?.length;
      const existingWallet = store.getters['wallets/walletByAddress'](checkedItems.value[0]);
      const isExist = !!existingWallet && existingWallet.type !== WALLET_TYPES.PUBLIC_KEY;

      return isCustomLoading.value || showLoader.value || !isChecked || isExist;
    });

    return {
      confirm,
      addSingleItem,
      checked,
      setCustomWallet,
      customWallet,
      isCustomLoading,
      showModal,
      showLoader,
      checkedItems,
      disabled,
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
}
</style>
