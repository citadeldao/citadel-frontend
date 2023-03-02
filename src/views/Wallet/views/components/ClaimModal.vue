<template>
  <ModalContent
    v-click-away="claimModalCloseHandler"
    :title="$t('claim.confirmModalTitle')"
    :desc="$t('claim.confirmModalDesc')"
    button-text="confirm"
    type="action"
    :loading="isLoading"
    :disabled="inputError"
    @close="claimModalCloseHandler"
    @buttonClick="$emit('claim')"
  >
    <ActionModalContent
      :to="currentWallet.address"
      :wallet="currentWallet"
      :staking-amount="currentWallet.balance.claimableRewards"
      :staking-fee="fee"
      :hide-password="
        isHardwareWallet || [WALLET_TYPES.KEPLR].includes(currentWallet.type)
      "
      :adding="adding"
      @submitSend="$emit('claim')"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import ActionModalContent from '../../views/Stake/components/ActionModalContent.vue';
import { WALLET_TYPES } from '@/config/walletType';

export default {
  components: {
    ModalContent,
    ActionModalContent,
  },
  props: {
    isHardwareWallet: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    currentWallet: {
      required: true,
    },
    fee: {
      type: [String, Number],
      required: true,
    },
    claimModalCloseHandler: {
      required: true,
    },
    inputError: {
      required: true,
    },
    adding: {
      required: true,
    },
  },
  setup() {
    return {
      WALLET_TYPES,
    };
  },
};
</script>
<style lang="scss" scoped></style>
