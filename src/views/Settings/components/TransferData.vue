<template>
  <div class="transfer-data">
    <div class="transfer-data__info">
      <span class="transfer-data__title">
        {{ $t('settings.transferData.title') }}
      </span>
      <div class="transfer-data__content">
        <div class="transfer-data__icon">
          <transferIcon />
        </div>
        <div class="transfer-data__desc">
          <div class="transfer-data__desc-text">
            {{ $t('settings.transferData.description') }}
          </div>
          <PrimaryButton
            class="transfer-data__button"
            :disabled="!hasWallets"
            @click="openQrModal"
          >
            {{ $t('settings.transferData.button') }}
          </PrimaryButton>
        </div>
      </div>
    </div>
  </div>
  <teleport to="body">
    <Modal v-if="showQrModal">
      <QrCard
        v-if="currentStep === 1"
        v-click-away="closeQrModal"
        @close="closeQrModal"
        @confirm="generateQr"
      />
      <QrInfo
        v-if="currentStep === 2"
        v-click-away="closeQrModal"
        :addresses="addresses"
        @close="closeQrModal"
      />
    </Modal>
  </teleport>
</template>

<script>
import { computed, ref, watch } from 'vue';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Modal from '@/components/Modal';
import QrInfo from './QrInfo';
import QrCard from './QrCard';
import transferIcon from '@/assets/icons/qr-scan.svg';
import useCurrentStep from '@/compositions/useCurrentStep';
import { WALLET_TYPES } from '@/config/walletType';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'TransferData',
  components: {
    PrimaryButton,
    Modal,
    QrInfo,
    QrCard,
    transferIcon,
  },
  setup() {
    const { currentStep, nextStep, setCurrentStep } = useCurrentStep(1, null);
    const showQrModal = ref(false);
    const addresses = ref([]);
    const { wallets } = useWallets();
    const hasWallets = computed(() => {
      return wallets.value.filter(wallet => wallet.type === WALLET_TYPES.ONE_SEED
          || wallet.type === WALLET_TYPES.PRIVATE_KEY)
        .length;});

    const generateQr = (list) => {
      addresses.value = list;
      nextStep();
    };

    const openQrModal = () => {
      showQrModal.value = true;
    };

    const closeQrModal = () => {
      showQrModal.value = false;
      addresses.value = [];
      setCurrentStep(1);
    };

    watch(currentStep, (value) => {
      if (value === 1) {
        addresses.value = [];
      }
    });

    return {
      addresses,
      showQrModal,
      currentStep,
      hasWallets,
      generateQr,
      openQrModal,
      closeQrModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.transfer-data {
  height: 100%;
  min-width: 150px;
  padding: 40px 45px;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  @include lg {
    padding: 30px 40px;
  }
  @include md {
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
    padding: 22px 29px 30px;
  }

  &__info {
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 20px;
    font-family: 'Panton_Bold';
    @include lg {
      margin-bottom: 9px;
    }
    @include lg {
      margin-bottom: 17px;
    }
  }

  &__desc {
    font-size: 16px;
    line-height: 27px;
    padding-top: 8px;
    margin-left: 50px;
    color: $mid-blue;
    @include lg {
      font-size: 14px;
      line-height: 24px;
      margin-left: 0;
      padding-top: 0;
    }
    @include md {
      font-size: 14px;
      line-height: 24px;
      padding-top: 2px;
      margin-left: 22px;
    }

    &-text {
      margin-bottom: 21px;
      @include lg {
        margin-bottom: 23px;
      }
      @include md {
        margin-bottom: 0;
      }
    }
  }

  &__content {
    display: flex;
  }

  &__icon {
    display: inline-block;

    & svg {
      height: 165px;
    }

    @include lg {
      display: none;
    }
    @include md {
      display: inline-block;
      & svg {
        height: 98px;
      }
    }
  }

  &__button {
    display: block;
    margin-left: auto;
    @include lg {
      margin: 0 auto;
    }
    @include md {
      display: block;
      margin-left: auto;
    }
  }
}
</style>
