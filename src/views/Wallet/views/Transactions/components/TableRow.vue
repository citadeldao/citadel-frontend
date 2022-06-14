<template>
  <tr
    class="table-row"
    :style="{ borderBottom: transaction.note ? 'none' : `` }"
    @click="$emit('showTransactionInfo', currentTransaction)"
  >
    <td class="table-row__type">
      <div class="table-row__type-block">
        <keep-alive>
          <component
            :is="icon"
            :width="32"
            :height="32"
          />
        </keep-alive>
        <span class="table-row__type-block-type">
          {{ type.title }}
        </span>
      </div>
    </td>
    <td class="table-row__status">
      <div class="table-row__status-info">
        <span class="table-row__status-info-type">
          {{ type.title }}
        </span>
        <span
          :style="{ color: status.color }"
          class="table-row__status-info-status"
        >
          {{ $t(status.title) }}
        </span>
      </div>
    </td>
    <td class="table-row__date-time">
      <span>{{ transaction.date ? moment(transaction.date).fromNow() : '' }}</span>
    </td>
    <td class="table-row__to">
      <div class="table-row__to-section">
        <out v-if="direction === 'income'" />
        <inIcon v-if="direction === 'outcome'" />
        <span>{{ address }}</span>
      </div>
    </td>
    <td class="table-row__amount">
      <div class="table-row__amount-content-wrapper">
        <div class="table-row__status-info">
          <span class="table-row__status-info-type">
            {{ type.title }}
          </span>
          <span
            :style="{ color: status.color }"
            class="table-row__status-info-status"
          >
            {{ $t(status.title) }}
          </span>
        </div>
        <div class="table-row__amount-block">
          <div class="table-row__amount-block-line">
            <div class="table-row__amount-block-date-time">
              <span>{{ transaction.date ? moment(transaction.date).fromNow() : '' }}</span>
            </div>
            <div class="table-row__amount-value">
              <span
                v-pretty-number="{ value: formatedValue, currency: currentWallet.code }"
                class="table-row__amount-value-value"
                :style="{ color: valueColor }"
              />
              <span class="table-row__amount-value-currency">
                {{ currentWallet.code }}
              </span>
              <comment
                v-if="transaction.note"
                class="table-row__comment-icon"
              />
            </div>
          </div>
          <div class="table-row__amount-block-line">
            <div class="table-row__amount-block-to">
              <out v-if="direction === 'income' || (fromMempool && transaction.direction === 'transfer')" />
              <inIcon v-if="direction === 'outcome'" />
              <span>{{ address }}</span>
            </div>
            <span
              v-if="!isNaN(fee)"
              class="table-row__amount-fee"
            >
              <span class="table-row__amount-fee-fee">{{ $t('fee') }}:</span>
              <span
                v-pretty-number="{ value: fee, currency: 'USD' }"
                class="table-row__amount-fee-value"
              />
              <span class="table-row__amount-fee-currency"> $ </span>
            </span>
          </div>
        </div>
      </div>

      <div class="table-row__amount-block-xl">
        <div class="table-row__amount-info">
          <div class="table-row__amount-value">
            <span
              v-pretty-number="{ value: formatedValue, currency: currentWallet.code }"
              class="table-row__amount-value-value"
              :style="{ color: valueColor }"
            />
            <span class="table-row__amount-value-currency">
              {{ currentWallet.code }}
            </span>
          </div>
          <span
            v-if="!isNaN(fee)"
            class="table-row__amount-fee"
          >
            <span class="table-row__amount-fee-fee">{{ $t('fee') }}:</span>
            <span
              v-pretty-number="{ value: fee, currency: 'USD' }"
              class="table-row__amount-fee-value"
            />
            <span class="table-row__amount-fee-currency"> $ </span>
          </span>
        </div>
        <comment
          v-if="transaction.note"
          class="table-row__comment-icon"
        />
      </div>
    </td>
  </tr>
  <tr v-if="transaction.note">
    <td
      colspan="5"
      class="table-row__comment"
    >
      <div class="table-row__arrow">
        <curveArrow />
      </div>
      <div class="table-row__comment-content">
        <div class="table-row__comment-title">
          <span>{{ $t('comment') }}</span>
          <EditButton @click="$emit('editComment', transaction)">
            {{ $t('edit') }}
          </EditButton>
        </div>
        <span class="table-row__comment-comment">
          {{ transaction.note }}
        </span>
      </div>
    </td>
  </tr>
</template>

<script>
import { computed, markRaw, ref } from 'vue';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import EditButton from '@/components/UI/EditButton';
import curveArrow from '@/assets/icons/transactions/curve-arrow.svg';
import comment from '@/assets/icons/transactions/comment.svg';
import inIcon from '@/assets/icons/transactions/in.svg';
import out from '@/assets/icons/transactions/out.svg';
import useTransaction from '@/compositions/useTransaction';

export default {
  name: 'TableRow',
  components: { inIcon, out, comment, curveArrow, EditButton },
  props: {
    transaction: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
    fromMempool: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['editComment', 'showTransactionInfo'],

  setup(props) {
    const { type } = useTransaction(props.transaction);
    const icon = ref();
    import(`@/assets/icons/transactions/${type.value.icon}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });
    const status = computed(() => {
      if (props.fromMempool) {
        return { title: 'waiting', color: '#F4BD13' };
      }

      if (
        props.transaction.isCanceled ||
        props.transaction.type === 'unvote'
      ) {
        return { title: 'fail', color: '#FA3B33' };
      }

      return { title: 'confirmed', color: '#0FB774' };
    });
    const address = computed(() => {
      if (props.fromMempool) {
        return props.transaction.direction === 'outcome'
          ? props.transaction.to
          : props.transaction.from;
      }

      if (direction.value === 'outcome') {
        return props.transaction.to;
      }

      if (direction.value === 'income') {
        return props.transaction.from;
      }

      return '';
    });
    const valueColor = computed(() =>
      direction.value === 'outcome' ? `#FA3B33` : `#0FB774`,
    );

    const fee = computed(() => {
      if (props.transaction.fee === 0) {
        return 0;
      }

      return props.fromMempool
        ? props.transaction.fee
        : BigNumber(
          props.transaction.price?.USD || props.transaction.price?.usd,
        )
          .times(props.transaction.fee)
          .toNumber();
    });
    const formatedValue = computed(() => {
      return BigNumber(props.transaction.value).toNumber();
    });
    const currentTransaction = ref({
      ...props.transaction,
      formatedStatus: status.value,
      date: props.transaction.date ? moment(props.transaction.date).fromNow() : '',
      value: formatedValue.value,
    });

    const direction = computed(() => {
      if (
        props.transaction?.to?.toLowerCase() ===
        props.currentWallet?.address?.toLowerCase()
      ) {
        return 'income';
      }

      return 'outcome';
    });

    return {
      icon,
      type,
      status,
      moment,
      address,
      valueColor,
      fee,
      currentTransaction,
      formatedValue,
      direction,
    };
  },
};
</script>

<style lang="scss" scoped>
.table-row {
  cursor: pointer;
  border-bottom: 1px solid $too-ligth-blue;

  & td {
    padding: 16px 0 30px 0;
    @include lg {
      padding: 16px 0 16px 0;
    }
    @include md {
      padding: 16px 0 16px 0;
    }

    &:first-child {
      padding-left: 24px;
      @include md {
        padding-right: 16px;
      }
      @include lg {
        width: 48px;
      }

    }

    &:last-child {
      text-align: right;
      padding-right: 20px;
      @include lg {
        padding-right: 0px;
      }
      @include md {
        padding-right: 15px;
      }
    }
  }

  &__type {
    @include lg {
      padding-bottom: 36px !important;
    }
  }

  &__type-block {
    display: flex;
    align-items: center;
    @include lg {
      align-items: initial;
    }

    & svg {
      margin-right: 16px;
    }
  }

  &__type-block-type {
    @include lg {
      display: none;
    }
  }

  &__type-block-type,
  &__amount-block-type,
  &__status-info-status,
  &__status-info-type {
    font-family: "Panton_Bold";
    font-size: 16px;
    line-height: 19px;
  }

  &__status-info-status {
    @include lg {
      margin-top: 11px;
      font-size: 14px;
    }
    @include md {
      display: none;
    }
  }

  &__status-info-type {
    display: none;
    @include lg {
      display: initial;
    }
  }

  &__status {
    padding-right: 20px !important;
    @include lg {
      display: none;
    }
    @include md {
      display: none;
    }
  }

  &__status-info {
    display: flex;
    flex-direction: column;
  }

  &__date-time {
    display: none;
    padding-right: 20px !important;
    @include xl {
      display: table-cell;
    }

    & span {
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.02em;
      color: $mid-blue;

      &:first-child {
        margin-right: 10px;
      }
    }
  }

  &__to {
    display: none;
    @include xl {
      display: table-cell;
    }
  }

  &__to-section {
    align-items: center;
    display: flex;

    & svg {
      margin-right: 16px;
    }

    & span {
      max-width: 299px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.02em;
      color: $too-dark-blue;
    }
  }

  &__amount {
    padding: 0px 0px 0px 0px !important;
    vertical-align: middle;

    & .table-row__status-info {
      display: none;
      @include lg {
        display: flex;
        align-items: flex-start;
        margin-right: 16px;
        width: 70px;
      }
    }

    @include md {
      padding: 0px 15px 0px 0px !important;
    }
  }

  &__amount-content-wrapper {
    display: flex;
    @include md {
      justify-content: flex-end;
    }
  }

  &__amount-block {
    display: flex;
    flex-direction: column;
    @include xl {
      display: none;
    }
    @include lg {
      flex-grow: 1;
    }
  }

  &__amount-block-line {
    display: flex;
    justify-content: space-between;
    @include md {
      justify-content: flex-end;
    }

    &:last-child {
      margin-top: 11px;
      @include md {
        display: none;
      }
    }
  }

  &__amount-block-date-time {
    display: flex;
    align-items: center;
    @include md {
      display: none;
    }

    & span {
      font-size: 14px;
      line-height: 17px;
      letter-spacing: -0.02em;
      color: $mid-blue;

      &:first-child {
        margin-right: 10px;
      }
    }
  }

  &__amount-block-to {
    display: flex;
    align-items: center;

    & svg {
      margin-right: 6px;
    }

    & span {
      max-width: 255px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      line-height: 19px;
      letter-spacing: -0.02em;
      color: $too-dark-blue;
    }
  }

  &__amount-block-xl {
    display: none;
    justify-content: flex-end;
    @include xl {
      display: flex;
    }
  }

  &__amount-info {
    display: flex;
    flex-direction: column;
  }

  &__amount-value {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__amount-value-value,
  &__amount-value-currency {
    font-size: 16px;
    line-height: 19px;
    color: $black;
    font-family: "Panton_Regular";
  }

  &__amount-value-value {
    font-family: "Panton_Bold" !important;
    margin-right: 3px;
  }

  &__amount-fee {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  &__amount-fee-fee,
  &__amount-fee-value,
  &__amount-fee-currency {
    font-size: 14px;
    line-height: 17px;
    color: $mid-gray;
  }

  &__amount-fee-value {
    font-family: "Panton_Bold" !important;
    letter-spacing: -0.02em;
    color: $mid-blue;
    margin-right: 3px;
  }

  &__amount-fee-currency {
    color: $black;
  }

  &__amount-fee-fee {
    margin-right: 8px;
  }

  &__comment-icon {
    margin-left: 9px;
    @include lg {
      margin-left: 15px;
    }
  }

  &__comment {
    width: 0;
    border-top: 1px dashed $too-ligth-blue;
    position: relative;
    padding: 14px 87px 12px 70px;
    border-bottom: 1px solid $too-ligth-blue;
    @include lg {
      padding: 16px 7px 9px 70px;
    }
    @include md {
      padding: 8px 14px 12px 70px;
    }
  }

  &__arrow {
    position: absolute;
    padding: 0px 23px 0px 29px;
    height: 53px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -2px;
    background: white;
    @include md {
      top: -8px;
    }
  }

  &__comment-content {
    display: flex;
    flex-direction: column;
  }

  &__comment-title {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    @include md {
      margin-bottom: 2px;
    }

    & span {
      font-size: 16px;
      line-height: 25px;
      color: $too-dark-blue;
      font-family: "Panton_SemiBold";
      margin-right: 6px;
    }
  }

  &__comment-comment {
    font-size: 14px;
    line-height: 24px;
    color: $mid-blue;
    @include md {
      font-size: 12px;
      line-height: 22px;
    }
  }
}
</style>
