<template>
  <tr
    class="table-row"
    :style="{ borderBottom: transaction.note ? 'none' : `` }"
    @click="$emit('showTransactionInfo', currentTransaction)"
  >
    <td
      class="table-row__type"
      :class="{ 'table-row__type--no-border': transaction.note }"
    >
      <div class="table-row__type-block">
        <img
          v-if="transaction?.view && transaction?.view[0]?.icon"
          width="32"
          height="32"
          :src="transaction?.view[0]?.icon"
        />
        <keep-alive v-else>
          <component :is="icon" :width="32" :height="32" />
        </keep-alive>
        <span class="table-row__type-block-type">
          {{ transaction?.view[0]?.type || type.title }}
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
          :class="{ failed: transaction.error }"
          class="table-row__status-info-status"
        >
          {{
            transaction.error ? $t('transactionsPage.failed') : $t(status.title)
          }}
        </span>
      </div>
    </td>
    <td class="table-row__amount">
      <div v-if="formatedValue" class="table-row__amount-content-wrapper mini">
        <div class="table-row__amount-value">
          <span
            v-pretty-number="{
              value: showBalance ? formatedValue : HIDE_BALANCE_MASK,
              currency: formatedValueSymbol || currentWallet.code,
            }"
            class="table-row__amount-value-value"
            :style="{ color: valueColor }"
          />
          <span class="table-row__amount-value-currency">
            {{ (formatedValueSymbol || currentWallet.code).slice(0, 5) }}
          </span>
        </div>
      </div>

      <div class="table-row__amount-block-xl">
        <div v-if="formatedValue" class="table-row__amount-info">
          <div class="table-row__amount-value">
            <span
              v-pretty-number="{
                value: showBalance ? formatedValue : HIDE_BALANCE_MASK,
                currency: formatedValueSymbol || currentWallet.code,
              }"
              class="table-row__amount-value-value"
              :style="{ color: valueColor }"
            />
            <span class="table-row__amount-value-currency">
              {{ formatedValueSymbol || currentWallet.code }}
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
          <div class="time">
            {{ transaction.date ? moment(transaction.date).fromNow() : '' }}
          </div>
        </template>
      </Tooltip>
    </td>
    <td class="table-row__link">
      <linkIcon
        width="21"
        hidden="18"
        @click.stop="
          () => {
            global.open(txUrl, '_blank');
          }
        "
      />
    </td>
  </tr>
  <tr
    class="table-row__note"
    v-if="transaction.note"
    @click="$emit('showTransactionInfo', currentTransaction)"
  >
    <td colspan="5">
      <div :style="{ width: `${width}px` }">
        <div class="table-row__note-note">
          {{ transaction.note }}
        </div>
        <!-- <div v-if="showDots">...</div> -->
      </div>
    </td>
  </tr>
</template>

<script>
import { computed, markRaw, ref } from 'vue';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import useTransaction from '@/compositions/useTransaction';
import defaultDate from '@/helpers/date.js';
import linkIcon from '@/assets/icons/link.svg';
import Tooltip from '@/components/UI/Tooltip';
import { useI18n } from 'vue-i18n';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';

export default {
  name: 'TableRow',
  components: {
    Tooltip,
    linkIcon,
  },
  props: {
    width: {
      type: Number,
      default: 0,
    },
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
    const { t } = useI18n();

    const type = ref({
      title: '???',
      icon: 'unknown',
    });

    const store = useStore();
    const showBalance = computed(() => store.getters['balance/showBalance']);

    const global = computed(() => window);

    if (props.transaction.type) {
      const data = useTransaction(props.transaction);
      type.value = data.type.value;
    } else {
      const data = useTransaction(props.transaction.view[0]);
      type.value = data.type.value;
      // eslint-disable-next-line vue/no-setup-props-destructure
      type.value.title = props.transaction?.view[0]?.type;
    }

    if (type.value.title === '???' && props.transaction?.view) {
      // eslint-disable-next-line vue/no-setup-props-destructure
      type.value.title = props.transaction?.view[0]?.type;
      type.value.icon = 'unknown';
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
        return {
          title: 'waiting',
          color: '#F4BD13',
          headerTitle: t('transactionsPage.modalPendingHeader'),
          headerDescription: t('transactionsPage.modalPendingDescription'),
        };
      }

      if (
        props.transaction.error ||
        props.transaction.isCanceled ||
        props.transaction.type === 'unvote'
      ) {
        return {
          title: 'fail',
          color: '#FA3B33',
          headerTitle: t('transactionsPage.modalFailHeader'),
          headerDescription: t('transactionsPage.modalFailDescription'),
        };
      }

      return {
        title: 'confirmed',
        color: '#0FB774',
        headerTitle: t('transactionsPage.modalSuccessHeader'),
        headerDescription: t('transactionsPage.modalSuccessDescription'),
      };
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
      if (!props.transaction.view) return 0;
      let findType = 0;
      props.transaction.view.forEach((v) => {
        v.components.forEach((w) => {
          if (w.type === 'amount' && !findType) {
            findType = w;
          }
        });
      });
      return BigNumber(findType?.value?.text || 0).toNumber();
    });

    const formatedValueSymbol = computed(() => {
      if (!props.transaction.view) return '';
      let findType = 0;
      props.transaction.view.forEach((v) => {
        v.components.forEach((w) => {
          if (w.type === 'amount') {
            findType = w;
          }
        });
      });
      return findType?.value?.symbol || '';
    });

    const currentTransaction = ref({
      ...props.transaction,
      formatedStatus: status.value,
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
      formatedValueSymbol,
      direction,
      showBalance,
      HIDE_BALANCE_MASK,
    };
  },
};
</script>

<style lang="scss" scoped>
.table-row {
  cursor: pointer;
  box-sizing: border-box;
  // border-bottom: 1px solid $too-ligth-blue;

  &:has(.table-row__type--no-border) {
    td {
      &:last-child {
        border-bottom-right-radius: 0px;
      }
      &:first-child {
        border-bottom-left-radius: 0px;
      }
    }
  }
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
        // padding-right: 0px;
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

    img {
      margin-right: 10px;
    }
    @include lg {
      align-items: center;
    }

    & svg {
      margin-right: 7px;
    }
  }

  &__type-block-type {
    max-width: 145px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @include md {
      max-width: 240px;
    }
  }

  &__type-block-type,
  &__amount-block-type,
  &__status-info-status,
  &__status-info-type {
    font-family: 'Panton_Bold';
    font-size: 16px;
    line-height: 19px;

    &.failed {
      color: $red !important;
    }
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
    text-transform: capitalize;
    width: 120px;
    overflow: hidden;

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
    // padding-right: 20px !important;
    .time {
      font-size: 16px;
      line-height: 19px;
      letter-spacing: -0.02em;
      color: $mid-blue;
      margin-left: -5px;
    }

    @include xl {
      display: table-cell;
    }

    & span {
      &:first-child {
        margin-right: 10px;
      }
    }
  }

  &__link {
    padding-right: 20px;
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
      display: none;
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
.table-row__note {
  cursor: pointer;
  background: rgba(239, 249, 254, 0.7);
  &-note {
    overflow: hidden;
    text-overflow: ellipsis;
    color: $mid-blue;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: -0.02em;
    white-space: pre;
  }
  td {
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    > div {
      margin: -8px 24px 14px;
      white-space: nowrap;
      height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
    }
  }
}

body.dark {
  .table-row td {
    background: #1b1c31;
  }

  .table-row__note {
    background: #1b1c31;
  }

  .table-row__type-block-inner-amount {
    color: #00a3ff;
    background: #000;
  }

  .table-row__type-block-type {
    color: $white;
  }

  .table-row__amount-value-currency {
    color: #c3ceeb;
  }

  &__type {
    color: $white;
  }
}
</style>
