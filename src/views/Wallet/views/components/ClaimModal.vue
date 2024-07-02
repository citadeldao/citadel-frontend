<template>
  <ModalContent
    v-click-away="claimModalCloseHandler"
    :title="
      isRestake
        ? $t('claim.confirmModalTitleRestake')
        : $t('claim.confirmModalTitle')
    "
    :desc="$t('claim.confirmModalDesc')"
    button-text="confirm"
    type="action"
    :loading="isLoading"
    :disabled="inputError"
    @close="claimModalCloseHandler"
    @buttonClick="$emit('claim')"
  >
    <ActionModalContent
      :to="
        customClaimWallet ? customClaimWallet.address : currentWallet.address
      "
      :wallet="customClaimWallet || currentWallet"
      :staking-amount="
        customClaimWallet
          ? customClaimWallet.balance.claimableRewards
          : currentWallet.balance.claimableRewards
      "
      :staking-fee="fee"
      :hide-password="
        isHardwareWallet ||
        [WALLET_TYPES.KEPLR].includes(
          customClaimWallet ? customClaimWallet.type : currentWallet.type
        )
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
    isRestake: {
      type: Boolean,
      default: false,
    },
    currentWallet: {
      required: true,
    },
    customClaimWallet: {
      type: Object,
      default: () => {},
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
