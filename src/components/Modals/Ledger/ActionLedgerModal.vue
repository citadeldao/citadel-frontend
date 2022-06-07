<template>
  <ModalContent
    :title="$t('ledger.action.title')"
    :desc="$t('ledger.action.desc')"
    type="action-image"
    :button-text="$t('yes')"
    :button-text2="$t('tryBtn')"
    icon="action-ledger"
    @close="$emit('close')"
  />
</template>

<script>
import ModalContent from '@/components/ModalContent';
import Loading from '@/components/Loading';
import confirmLedger from '@/assets/icons/ledger/confirm-ledger.svg';

export default {
  name: 'ActionLedgerModal',
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
</style>
