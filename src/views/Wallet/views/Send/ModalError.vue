<template>
  <ModalContent
    v-click-away="errorCloseHandler"
    title="Warning"
    icon="warningIcon"
    :desc="txError"
    button-text="ok"
    type="warning"
    @close="errorCloseHandler"
    @buttonClick="errorClickHandler"
  />
</template>
<script>
import ModalContent from '@/components/ModalContent';

export default {
  name: 'ModalErrorSend',
  components: {
    ModalContent,
  },
  props: {
    txError: {
      required: true,
    },
    errorCloseHandler: {
      required: true,
    },
    errorClickHandler: {
      required: true,
    },
  },
};
</script>
