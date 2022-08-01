<template>
  <tr
    class="table-row"
    :style="{ borderBottom: transaction.note ? 'none' : `` }"
    @click="$emit('showTransactionInfo', currentTransaction)"
  >
    <td class="table-row__type">
      <div class="table-row__type-block">
        <keep-alive>
          <component :is="icon" :width="32" :height="32" />
        </keep-alive>
        <span class="table-row__type-block-type">
          {{ type.title }}
        </span>
        <div
          v-if="transaction.view && transaction.view.length > 1"
          class="table-row__type-block-inner-amount"
        >
          {{ transaction.view.length }}
        </div>
      </div>
    </td>
    <td class="table-row__status">
      <div class="table-row__status-info">
        <span
          :style="{ color: status.color }"
          class="table-row__status-info-status"
        >
          {{ $t(status.title) }}
        </span>
      </div>
    </td>
    <td class="table-row__amount">
      <div class="table-row__amount-content-wrapper mini">
        <div class="table-row__amount-value">
          <span
            v-pretty-number="{
              value: formatedValue,
              currency: currentWallet.code,
            }"
            class="table-row__amount-value-value"
            :style="{ color: valueColor }"
          />
          <span class="table-row__amount-value-currency">
            {{ currentWallet.code }}
          </span>
        </div>
      </div>

      <div class="table-row__amount-block-xl">
        <div class="table-row__amount-info">
          <div class="table-row__amount-value">
            <span
              v-pretty-number="{
                value: formatedValue,
                currency: currentWallet.code,
              }"
              class="table-row__amount-value-value"
              :style="{ color: valueColor }"
            />
            <span class="table-row__amount-value-currency">
              {{ currentWallet.code }}
            </span>
          </div>
        </div>
      </div>
    </td>
    <td class="table-row__date-time">
      <Tooltip>
        <template #content>
          <span> {{ defaultDate(transaction.date) }} </span>
        </template>
        <template #default>
          <span>{{
            transaction.date ? moment(transaction.date).fromNow() : ''
          }}</span>
          <linkIcon
            width="21"
            hidden="18"
            @click.stop="
              () => {
                global.open(txUrl, '_blank');
              }
            "
          />
        </template>
      </Tooltip>
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
import Loading from '@/components/Loading.vue';
import defaultDate from '@/helpers/date.js';
import linkIcon from '@/assets/icons/link.svg';
import Tooltip from '@/components/UI/Tooltip';

export default {
  name: 'TableRow',
  components: {
    inIcon,
    Tooltip,
    out,
    comment,
    curveArrow,
    EditButton,
    Loading,
    linkIcon,
  },
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
    let type;

    const global = computed(() => window);

    if (props.transaction.type) {
      const data = useTransaction(props.transaction);
      type = data.type;
    } else {
      const data = useTransaction(props.transaction.view[0]);
      type = data.type;
    }

    const icon = ref();
    import(`@/assets/icons/transactions/${type.value.icon}.svg`).then((val) => {
      icon.value = markRaw(val.default);
    });

    const txUrl = computed(() =>
      props.currentWallet?.getTxUrl(
        props.currentWallet.id,
        props.transaction.hash
      )
    );

    const status = computed(() => {
      if (props.fromMempool) {
        return { title: 'waiting', color: '#F4BD13' };
      }

      if (props.transaction.isCanceled || props.transaction.type === 'unvote') {
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
      direction.value === 'outcome' ? `#FA3B33` : `#0FB774`
    );

    const fee = computed(() => {
      if (+props.transaction.fee.text === 0) {
        return 0;
      }

      return props.fromMempool
        ? props.transaction.fee.text
        : +props.transaction.fee.text;
    });
    const formatedValue = computed(() => {
      return BigNumber(props.transaction.value).toNumber();
    });
    const currentTransaction = ref({
      ...props.transaction,
      formatedStatus: status.value,
      date: props.transaction.date
        ? moment(props.transaction.date).fromNow()
        : '',
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
      txUrl,
      global,
      defaultDate,
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
  box-sizing: border-box;
  // border-bottom: 1px solid $too-ligth-blue;

  & td {
    background: rgba(239, 249, 254, 0.7);
    height: 64px;
    // padding: 16px 0 30px 0;
    @include lg {
      // padding: 16px 0 16px 0;
    }
    @include md {
      // padding: 16px 0 16px 0;
    }

    &:first-child {
      padding-left: 24px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;

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
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;

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
      // padding-bottom: 36px !important;
    }
  }

  &__type-block {
    display: flex;
    align-items: center;
    @include lg {
      align-items: center;
    }

    & svg {
      margin-right: 7px;
    }
  }

  &__type-block-type {
    @include lg {
      // display: none;
    }
  }

  &__type-block-type,
  &__amount-block-type,
  &__status-info-status,
  &__status-info-type {
    font-family: 'Panton_Bold';
    font-size: 16px;
    line-height: 19px;
  }

  &__type-block-inner-amount {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 19px;
    background: #b6e5ff;
    border-radius: 2px;
    font-size: 12px;
    color: #1a53f0;
    font-family: 'Panton_Bold';
    margin-left: 7px;
  }

  &__status-info {
    &.hasMsgs {
      margin-left: -45px;
    }
  }

  &__status-info-status {
    @include lg {
      // margin-top: 11px;
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
      // display: none;
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
    // display: none;
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
    &.mini {
      @include xl {
        display: none;
      }
    }

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
    // justify-content: flex-end;
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
    // justify-content: flex-end;
  }

  &__amount-value-value,
  &__amount-value-currency {
    font-size: 16px;
    line-height: 19px;
    color: $black;
    font-family: 'Panton_Regular';
  }

  &__amount-value-value {
    font-family: 'Panton_Bold' !important;
    margin-right: 3px;
  }
}
</style>
