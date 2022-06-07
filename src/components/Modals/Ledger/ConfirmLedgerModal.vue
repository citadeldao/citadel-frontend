<template>
  <ModalContent
    :title="$t('ledger.confirm.title')"
    :desc="$t('ledger.confirm.desc')"
    type="action"
    :submit-button="false"
    @close="$emit('close')"
  >
    <div class="connect__wrap">
      <div class="connect__image">
        <confirmLedger />
        <div class="loader__wrap">
          <Loading
            ledger
          />
        </div>
      </div>
    </div>
  </ModalContent>
</template>

<script>
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';
import confirmLedger from '@/assets/icons/ledger/confirm-ledger1.svg';

export default {
  name: 'ConfirmLedgerModal',
  components: {
    ModalContent,
    Loading,
    confirmLedger,
  },
  emits: ['close'],
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.connect {
  &__wrap {
    height: 251px;
  }
  &__image {
    position: relative;
  }
  &__loader {
    top: -6px;
    left: -6px;
  }
}
.loader__wrap {
  position: absolute;
  transform: rotate(28.8deg);
  background: transparent;
  left: 136px;
  top: 144px;
  width: 12px;
  height: 12px;
}
</style>
