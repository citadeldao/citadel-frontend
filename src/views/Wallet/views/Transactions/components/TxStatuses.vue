<template>
  <div class="tx-statuses">
    <div class="tx-statuses__item">
      <div class="icon">
        <success
          v-if="!info.error && info?.formatedStatus?.title === 'confirmed'"
        />
        <pending v-if="false" />
        <error v-if="info.error" />
      </div>
      <div class="status">
        <div class="label">{{ $t('status') }}</div>
        <Tooltip>
          <template #default>
            <div
              :class="{ failed: info.error }"
              :style="{ color: info?.formatedStatus?.color }"
              class="value stat"
            >
              {{
                info.error
                  ? $t('transactionsPage.failed')
                  : info?.formatedStatus?.title
              }}
            </div>
          </template>
          <template #content>
            <div class="time">
              {{ info.error || info?.formatedStatus?.title }}
            </div>
          </template>
        </Tooltip>
      </div>
    </div>
    <div class="tx-statuses__item">
      <div class="icon">
        <calendar />
      </div>
      <div class="status">
        <div class="value time">
          <span>{{ formatedDate.first }}</span>
          <span>{{ formatedDate.second }}</span>
        </div>
      </div>
    </div>
    <div v-if="info.fee" class="tx-statuses__item">
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
import Tooltip from '@/components/UI/Tooltip';
import defaultDate from '@/helpers/date.js';
import { computed } from 'vue';
import { format } from 'date-fns';
export default {
  components: { success, pending, error, calendar, fee, Tooltip },
  props: {
    info: {
      required: true,
    },
    currentWallet: {
      required: true,
    },
  },
  setup(props) {
    const formatedDate = computed(() => {
      return {
        first: format(new Date(props.info.date), 'yyyy/MM/dd'),
        second: format(new Date(props.info.date), 'hh:mm:ss'),
      };
    });
    return {
      formatedDate,
      defaultDate,
    };
  },
};
</script>
<style lang="scss" scoped>
.tx-statuses {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 20px;
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

        &.time {
          margin-left: -5px;
          display: flex;
          flex-direction: column;
          & span:first-child {
            color: $fieldName;
          }
        }
      }

      .stat {
        text-transform: capitalize;
        font-weight: 700;
        color: $waitingStatus;
        margin-left: -5px;

        &.failed {
          color: $red !important;
          border-bottom: 1px dashed $red;
        }
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
