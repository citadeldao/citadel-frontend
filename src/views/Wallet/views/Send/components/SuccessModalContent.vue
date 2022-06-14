<template>
  <div
    ref="comp"
    class="success-modal-content"
  >
    <div
      v-if="showStatuses"
      class="success-modal-content__statuses"
    >
      <div class="success-modal-content__status">
        <div
          class="success-modal-content__status-icon"
          :style="{ background: '#0FB774' }"
        >
          <done />
        </div>
        <span class="success-modal-content__status-title">
          {{ $t("addedToMempool") }}
        </span>
      </div>
      <div class="success-modal-content__status-icon-divider-rigth" />
      <div class="success-modal-content__status">
        <div
          class="success-modal-content__status-icon"
          :style="{ background: '#F4BD13' }"
        >
          <clock />
        </div>
        <span class="success-modal-content__status-title">
          {{ $t("pending") }}
          <span class="success-modal-content__status-title-time">{{ txDuration }}</span>
        </span>
      </div>
      <div class="success-modal-content__status-icon-divider-left" />
      <div class="success-modal-content__status">
        <div
          class="success-modal-content__status-icon"
          :style="{ background: '#C3CEEB' }"
        >
          <confirmed />
        </div>
        <span class="success-modal-content__status-title">
          {{ $t('confirmed') }}
        </span>
      </div>
    </div>
    <SendDirection
      :to="to"
      :amount="amount"
      :wallet="wallet"
      :viewing-key="viewingKey"
      :tx-hash="txHash"
      :show-from="showFrom"
      :token-name="snip20Token?.name"
      :mode="mode"
      :active-tab="activeTab"
      :redelegation-node-address="redelegationNodeAddress"
    />
    <NominatedNodes
      v-if="isMultiple"
      class="success-modal-content__nominated-nodes"
      :selected-node="mode === 'redelegate' ? selectedNodeForRedelegation : selectedNode"
    />
    <div
      v-if="txHash.length === 1 && wallet.hasTransactionComment"
      class="success-modal-content__textarea"
    >
      <Textarea
        id="comment"
        icon="text"
        :value="txComment"
        :label="$t('comment')"
        :placeholder="$t('enterTextComment')"
        :data-qa="dataQa && `${dataQa}--comment-field`"
        @update:value="$emit('update:txComment', $event)"
      />
    </div>
  </div>
</template>

<script>

import { nextTick, onMounted, getCurrentInstance, ref, inject } from 'vue';
import NominatedNodes from '../../Stake/components/NominatedNodes.vue';

import { useI18n } from 'vue-i18n';

import Textarea from '@/components/UI/Textarea';
import SendDirection from './SendDirection.vue';
import done from '@/assets/icons/done.svg';
import clock from '@/assets/icons/clock.svg';
import confirmed from '@/assets/icons/confirmed.svg';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'SuccessModalContent',
  components: { done, clock, confirmed, SendDirection, Textarea, NominatedNodes },
  props: {
    isMultiple: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: '',
    },
    snip20Token: {
      type: Object,
      default: ()=>{},
    },
    wallet: {
      type: Object,
      default: ()=>{},
    },
    amount: {
      type: [Number, String],
      default: 0,
    },
    txHash: {
      type: [Array, String],
      default: '',
    },
    showStatuses: {
      type: Boolean,
      default: true,
    },
    txComment: {
      type: String,
      default: '',
    },
    showFrom: {
      type: Boolean,
      default: true,
    },
    viewingKey: {
      type: String,
      default: '',
    },
    showCommentInput: {
      type: Boolean,
      default: true,
    },
    dataQa: {
      type: [String, null],
      default: null,
    },
    mode: {
      type: String,
      default: '',
    },
    activeTab: {
      type: String,
      default: '',
    },
    redelegationNodeAddress: {
      type: String,
      default: '',
    },
    selectedNode: {
      type: Object,
      default: () => ({}),
    },
    fee: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: 'transfer',
    },
  },
  emits: ['update:txComment'],
  setup(props) {
    const { t } = useI18n();
    const instance = getCurrentInstance();
    const txDuration = ref('');
    const { currentWallet } = useWallets();
    const selectedNodeForRedelegation = inject('selectedNodeForRedelegation');

    const getTxDuration = async ({ type, fee }) => {
      const { data } = await currentWallet.value.getTxDuration({ type, fee });
      const { min, max } = data;

      if (min && max) {
        const minMin = (min / 1000 / 60).toFixed(0);
        let maxMin = (max / 1000 / 60).toFixed(0);

        if (maxMin < 1) {
          maxMin = 1;
        }

        txDuration.value = `${minMin}-${maxMin} ${t('min')}`;

        return;
      }

      txDuration.value = `3-5 ${t('min')}`;
    };

    onMounted(() => {
      if (props.type && props.fee !== null) {
        getTxDuration({
          type: props.type,
          fee: props.fee,
        });
      }

      nextTick(() => {
        instance.parent.refs.primaryButton.$el.focus();
      });
    });

    return {
      txDuration,
      selectedNodeForRedelegation,
    };
  },
};
</script>

<style lang="scss" scoped>
.success-modal-content {
  padding-top: 26px;
  display: flex;
  width: 100%;
  flex-direction: column;

  &__statuses {
    position: relative;
    display: flex;
    width: 100%;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  &__status {
    width: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__status-title,
  &__status-title-time {
    font-size: 14px;
    line-height: 17px;
    color: $too-dark-blue;
    text-align: center;
    margin-top: 5px;
    font-family: "Panton_SemiBold";
  }

  &__status-title-time {
    color: $ligth-blue;
  }

  &__status-icon {
    width: 45px;
    height: 45px;
    border-radius: $round;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__status-icon-divider-rigth,
  &__status-icon-divider-left {
    position: absolute;
    width: 172px;
    border-bottom: 1px solid $too-ligth-blue;
    margin: 0 6px;
    bottom: 66px;

    &:first-child {
      right: 54px;
    }
  }

  &__status-icon-divider-left {
    left: 54px;
  }

  &__status-icon-divider-rigth {
    right: 54px;
  }

  &__textarea {
    height: 120px;
    margin-top: 17px;
  }
  &__nominated-nodes {
    margin-top: 15px;
  }
}
</style>
