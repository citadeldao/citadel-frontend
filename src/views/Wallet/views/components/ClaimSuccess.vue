<template>
  <ModalContent
    v-click-away="claimModalCloseHandler"
    title="Success"
    :desc="$t('txWaitTitle')"
    button-text="ok"
    type="success"
    icon="success"
    @close="claimModalCloseHandler"
    @buttonClick="$emit('success')"
  >
    <SuccessModalContent
      v-model:txComment="comment"
      :to="currentToken ? '' : currentWallet.address"
      :wallet="currentToken || currentWallet"
      :custom-code="claimCustom ? claimCustom.code : ''"
      :amount="
        currentToken
          ? totalAmount
          : claimCustom
          ? claimCustom.amount
          : currentWallet.balance.claimableRewards
      "
      :tx-hash="txHash"
      :show-from="false"
      type="reward"
      :fee="mode === 'claim' ? claimFee : fee"
    />
  </ModalContent>
</template>
<script>
import ModalContent from '@/components/ModalContent';
import SuccessModalContent from '../../views/Send/components/SuccessModalContent';
import { computed, ref, watch } from 'vue';

export default {
  components: {
    ModalContent,
    SuccessModalContent,
  },
  props: {
    claimModalCloseHandler: {
      required: true,
    },
    txHash: {
      type: Boolean,
      default: false,
    },
    currentToken: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
    fee: {
      type: [String, Number],
      required: true,
    },
    claimFee: {
      required: true,
    },
    mode: {
      required: true,
    },
    totalAmount: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const comment = ref('');

    const customClaimBalance = computed(() => {
      if (!props.currentWallet) return null;
      const defaultRewards =
        props.currentWallet.config?.frontConfiguration?.data?.default_rewards;
      if (!defaultRewards) return null;

      return props.currentWallet?.balance?.rewardsList?.find(
        (item) => item.net === defaultRewards
      );
    });

    const claimCustom = ref(null);
    claimCustom.value = { ...customClaimBalance.value };

    watch(
      () => comment.value,
      () => {
        emit('changeComment', comment.value);
      }
    );

    return {
      claimCustom,
      comment,
    };
  },
};
</script>
<style lang="scss" scoped></style>
