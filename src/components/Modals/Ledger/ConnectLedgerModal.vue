<template>
  <ModalContent
    :title="$t('ledger.connect.title')"
    :desc="$t('ledger.connect.desc')"
    type="action"
    :submit-button="false"
    @close="$emit('close')"
  >
    <div v-if="showConnect" class="connect__wrapper connect__wrapper-animation">
      <img src="@/assets/gif/connectLedger.gif" alt="" />
    </div>
    <div v-else class="connect__wrapper">
      <div class="connect__image">
        <Loading small class="connect__loader" />
      </div>
      <div v-if="error" class="connect__section">
        <div class="connect__error-message">
          <warning />
          <span>{{ error }}</span>
        </div>
        <PrimaryButton @click.stop="clickHandler">
          {{ $t('retry') }}
        </PrimaryButton>
      </div>
    </div>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';
import PrimaryButton from '@/components/UI/PrimaryButton';
import warning from '@/assets/icons/warning.svg';
import { ref } from '@vue/reactivity';

export default {
  name: 'ConnectLedgerModal',
  components: {
    ModalContent,
    Loading,
    PrimaryButton,
    warning,
  },
  props: {
    error: {
      type: [String, Boolean],
    },
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const clickHandler = () => {
      emit('buttonClick');
    };
    const showConnect = ref(true);
    setTimeout(() => {
      showConnect.value = false;
    }, 6000);

    return { clickHandler, showConnect };
  },
};
</script>

<style lang="scss" scoped>
.connect {
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 276px;
    &-animation {
      justify-content: center;
    }
  }
  &__image {
    height: 190px;
  }

  &__loader {
    margin-top: 90px;
  }
  &__section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__error-message {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32px;
    & svg {
      margin-right: 8px;
    }
    & span {
      font-size: 14px;
      line-height: 17px;
      color: $orange;
    }
  }
}
</style>
