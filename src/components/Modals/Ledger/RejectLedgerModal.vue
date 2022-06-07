<template>
  <ModalContent
    :title="$t('ledger.rejected.title')"
    :desc="$t('ledger.rejected.desc')"
    type="warning"
    :submit-button="false"
    @close="$emit('close')"
  >
    <div class="reject__wrap">
      <!-- <div class="reject__image">
      </div> -->
    </div>
    <PrimaryButton
      @click.stop="clickHandler"
    >
      {{ $t(`ok`) }}
    </PrimaryButton>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import PrimaryButton from '@/components/UI/PrimaryButton';

export default {
  name: 'RejectLedgerModal',
  components: {
    ModalContent,
    PrimaryButton,
  },
  emits: ['close', 'buttonClick'],
  setup(props, { emit }) {
    const clickHandler = () => {
      emit('buttonClick');
    };

    return { clickHandler };
  },
};
</script>

<style lang="scss" scoped>
.reject {
  &__wrap {
    margin-bottom: 26px;
  }
  &__image {
    position: relative;
    margin-top: 45px;
  }
  &__loader {
    position: absolute;
    left: -13px;
    bottom: -10px;
    background: $white;
  }
}
</style>
