<template>
  <div class="tx-statuses">
    <div class="tx-statuses__item">
      <div class="icon">
        <success v-if="info?.formatedStatus?.title === 'confirmed'" />
        <pending v-if="false" />
        <error v-if="false" />
      </div>
      <div class="status">
        <div class="label">{{ $t('status') }}</div>
        <div :style="{ color: info?.formatedStatus?.color }" class="value stat">
          {{ info?.formatedStatus?.title }}
        </div>
      </div>
    </div>
    <div class="tx-statuses__item">
      <div class="icon">
        <calendar />
      </div>
      <div class="status">
        <div class="label">{{ $t('date') }}</div>
        <div class="value time">{{ info.date }}</div>
      </div>
    </div>
    <div class="tx-statuses__item">
      <div class="icon">
        <fee />
      </div>
      <div class="status">
        <div class="label">{{ $t('fee') }}</div>
        <div class="value fee">
          {{ info?.fee?.text }} <span>{{ info?.fee?.symbol }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import success from '@/assets/icons/transaction-status/success.svg';
import calendar from '@/assets/icons/transaction-status/calendar.svg';
import fee from '@/assets/icons/transaction-status/fee.svg';
import pending from '@/assets/icons/transaction-status/pending.svg';
import error from '@/assets/icons/transaction-status/error.svg';

export default {
  components: { success, pending, error, calendar, fee },
  props: {
    info: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
  },
  setup(props) {
    console.log(props.info);
  },
};
</script>
<style lang="scss" scoped>
.tx-statuses {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 10px;
  border-bottom: 1px dashed #bcc2d8;

  &__item {
    display: flex;
    align-items: center;

    .status {
      margin-left: 10px;

      .label {
        color: $fieldName;
        font-size: 14px;
      }

      .value {
        margin-top: 3px;
        font-size: 14px;
        font-weight: 400;
        color: #6b93c0;
      }

      .stat {
        text-transform: capitalize;
        font-weight: 700;
        color: $waitingStatus;
      }

      .fee {
        color: #fa3b33;
        font-weight: 700;

        span {
          font-weight: 400;
          color: #6b93c0;
        }
      }
    }
  }
}
</style>
