<template>
  <ModalContent
    :title="$t('ledger.openApp.title')"
    :desc="$t('ledger.openApp.desc')"
    type="action"
    :submit-button="false"
    @close="$emit('close')"
  >
    <div class="open__wrap">
      <div class="open__image">
        <confirmLedger />
        <keep-alive>
          <component
            :is="currentIcon"
            class="open__icon"
          />
        </keep-alive>
      </div>
      <PrimaryButton
        @click.stop="clickHandler"
      >
        {{ $t(`retry`) }}
      </PrimaryButton>
    </div>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import confirmLedger from '@/assets/icons/ledger/confirm-ledger1.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import { markRaw, ref } from '@vue/reactivity';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'OpenAppLedgerModal',
  components: {
    ModalContent,
    confirmLedger,
    PrimaryButton,
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const { currentWallet } = useWallets();
    const clickHandler = () => {
      emit('buttonClick');
    };
    const currentIcon = ref();
    import(`@/assets/icons/networks/${currentWallet.value.net}.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return { clickHandler, currentIcon };
  },
};
</script>

<style lang="scss" scoped>
.open {
  &__wrap {
    flex-direction: column;
    display: flex;
    align-items: center
  }
  &__image {
    position: relative;
    margin-bottom: 23px;
  }
  &__icon {
    position: absolute;
    left: 132px;
    top: 140px;
    transform: rotate(28.8deg);
    fill: $dark-blue;
    max-width: 18px;
    max-height: 18px;
  }
}
</style>
