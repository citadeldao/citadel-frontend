<template>
  <div
    class="transfer-data"
    :class="`${Boolean(hasWallets)}`"
    v-on="Boolean(hasWallets) ? { click: openQrModal } : {}"
  >
    <div class="transfer-data__img">
      <TransferIcon />
    </div>
    <div class="transfer-data__content">
      <h4 class="title">
        {{ $t('settings.transferData.title') }}
      </h4>
      <span class="description">
        {{ $t('settings.transferData.description') }}
      </span>
    </div>
    <PrimaryButton
      class="transfer-data__button"
      :disabled="!hasWallets"
      @click="openQrModal"
    >
      {{ $t('settings.transferData.button') }}
    </PrimaryButton>
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
import TransferIcon from '@/assets/icons/qr-scan.svg';
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
    TransferIcon,
  },
  setup() {
    const { currentStep, nextStep, setCurrentStep } = useCurrentStep(1, null);
    const showQrModal = ref(false);
    const addresses = ref([]);
    const { wallets } = useWallets();
    const hasWallets = computed(() => {
      return wallets.value.filter(
        (wallet) =>
          wallet.type === WALLET_TYPES.ONE_SEED ||
          wallet.type === WALLET_TYPES.PRIVATE_KEY
      ).length;
    });

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
  @include settings-card-default;
  position: relative;
  z-index: 1;
  line-height: 1.4 !important;

  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  flex-wrap: wrap;

  @include laptop-l {
    cursor: pointer;
    flex-direction: row;
    flex-wrap: nowrap;
    transition: all 0.3s;

    &.true::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 0;
      transition: all 0.4s;
      background: $light-blue-1;
      z-index: -1;
    }

    &.true:hover {
      &::after {
        width: 100%;
      }
    }
    &.false {
      cursor: not-allowed;
      background: $too-ligth-blue;
      & .title {
        color: $white;
      }
    }
  }

  &__img {
    height: 60px;
    width: 60px;
    svg {
      height: 100%;
      width: 100%;
    }

    @include xs-lg {
      align-self: flex-start;
    }
    @include laptop-l {
      width: 48px;
      height: 48px;
    }
  }

  &__content {
    width: 60%;
    margin-left: $card-margin;
    margin-right: auto;

    & > * {
      margin: 0;
    }
    @include laptop-l {
      width: 70%;
    }
    .title {
      @include title-default;
    }

    .description {
      @include text-default;
      margin: 5px 0 0;
      @include laptop-l {
        display: none;
      }
      @include laptop {
        display: none;
      }
    }
  }
  &__button {
    align-self: center;
    margin-left: auto;
    @include md {
      display: none;
    }
    @include laptop-l {
      display: none;
    }
  }
}
</style>
