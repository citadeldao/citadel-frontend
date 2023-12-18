<template>
  <div class="connect-device">
    <h4 class="connect-device__title">
      {{ $t('importLedger.title') }}
    </h4>
    <div class="connect-device__card-wrapper">
      <ConnectCard icon="laptop" :title="$t('yourComputer')" />
      <ConnectCard icon="ledger" title="Ledger" :style="{ marginRight: 0 }" />
      <div class="connect-device__direction">
        <arrowRigth />
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div v-if="isLoading">
        <Loading small />
      </div>
      <div v-else class="connect-device__section">
        <div class="connect-device__error-message">
          <warning />
          <span>{{ ledgerError }}</span>
        </div>
        <PrimaryButton @click="clickHandler">
          {{ $t('retry') }}
        </PrimaryButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, inject } from 'vue';
import warning from '@/assets/icons/warning.svg';
import arrowRigth from '@/assets/icons/arrow-rigth.svg';
import ConnectCard from '@/components/ConnectCard';
import Loading from '@/components/Loading';
import PrimaryButton from '@/components/UI/PrimaryButton';
import useLedger from '@/compositions/useLedger';
import { useStore } from 'vuex';

export default {
  name: 'ConnectDevice',
  components: { PrimaryButton, Loading, ConnectCard, arrowRigth, warning },
  props: {
    net: {
      type: String,
    },
    isBluetooth: {
      type: [Boolean, String],
    },
  },
  setup(props) {
    const store = useStore();
    const nextStep = inject('nextStep');
    const isLoading = ref(true);

    const { ledgerError, ledgerErrorHandler } = useLedger();

    const checkLedger = async () => {
      isLoading.value = true;

      const { error } = await store.dispatch('crypto/createLedgerWallet', {
        net: props.net,
        transportType: props.isBluetooth ? 'bt' : 'usb',
      });
      error && ledgerErrorHandler(error);

      if (!error) {
        ledgerError.value = '';
      } // need to reset ledgerError if no error

      isLoading.value = false;

      if (!ledgerError.value) {
        nextStep();
      }
    };
    checkLedger();

    const clickHandler = async () => {
      checkLedger();
    };

    return {
      clickHandler,
      isLoading,
      ledgerError,
    };
  },
};
</script>

<style lang="scss" scoped>
.connect-device {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-left: 45px;
  @include lg {
    padding-top: 32px;
  }
  @include md {
    padding-top: 24px;
    padding-left: 25px;
  }

  &__title {
    font-size: 20px;
    line-height: 30px;
    margin: 0;
    font-family: 'Panton_Bold';
    margin-bottom: 24px;
    font-weight: 700;
  }

  &__card-wrapper {
    display: flex;
    position: relative;
    margin-bottom: 33px;
  }

  &__direction {
    width: 68px;
    height: 68px;
    border: 1px dashed $too-ligth-blue;
    border-radius: $round;
    display: flex;
    justify-content: center;
    background: $white;
    align-items: center;
    position: absolute;
    right: 256px;
    top: 106px;
    @include lg {
      right: 237px;
    }
    @include md {
      right: 213px;
      width: 50px;
      height: 50px;
    }

    & svg {
      width: 17px;
      height: 28px;
      fill: $dark-blue;
    }
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

body.dark {
  .connect-device {
    &__title {
      color: $white;
    }
  }
}
</style>
