<template>
  <ModalContent
    v-click-away="claimModalCloseHandler"
    :title="$t('claim.confirmModalTitle')"
    :desc="$t('claim.confirmModalDesc')"
    button-text="restake"
    type="action"
    :disabled="disabled"
    :loading="loading"
    :has-slot="true"
    @close="claimModalCloseHandler"
    @buttonClick="$emit('buttonClick')"
  >
    <template #default>
      <XCTConfirmClaimModal
        :fee="claimFee"
        :current-token="currentToken"
        :claim-options="claimOptions"
        :xct-rewards="xctRewards"
        :hide-password="hidePassword"
        :dao-rewards="daoRewards"
        :total-amount="totalAmount"
        @update:options="updateOptions"
        @submitSend="$emit('submitSend')"
      />
    </template>
    <template #cancelButton>
      <span
        class="wallet__modal-claim-button"
        :class="{ 'wallet__modal-claim-button--disabled': disabled }"
        @click="$emit('claimXctRewards')"
        >{{ $t('claim.claim') }}</span
      >
    </template>
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import XCTConfirmClaimModal from '../../views/Stake/components/XCTConfirmClaimModal.vue';

export default {
  components: {
    ModalContent,
    XCTConfirmClaimModal,
  },
  props: {
    claimModalCloseHandler: {
      required: true,
    },
    disabled: {
      required: true,
    },
    loading: {
      required: true,
    },
    claimFee: {
      required: true,
    },
    currentToken: {
      required: true,
    },
    claimOptions: {
      required: true,
    },
    xctRewards: {
      required: true,
    },
    hidePassword: {
      required: true,
    },
    daoRewards: {
      required: true,
    },
    totalAmount: {
      required: true,
    },
  },
  setup(_, { emit }) {
    const updateOptions = (data) => {
      emit('updateOptions', data);
    };

    return {
      updateOptions,
    };
  },
};
</script>
<style lang="scss" scoped>
.wallet__modal-claim-button {
  margin-top: 24px;
  cursor: pointer;
  font-size: 18px;
  line-height: 27px;
  text-decoration-line: underline;
  color: $too-dark-blue;
  font-family: 'Panton_Bold';

  &--disabled {
    color: $mid-gray;
    pointer-events: none;
  }

  &:hover {
    color: $blue;
  }

  @include lg {
    align-self: center;
  }
  @include md {
    align-self: flex-end;
  }
}
</style>
