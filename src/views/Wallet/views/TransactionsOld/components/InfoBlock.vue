<template>
  <div class="info-block">
    <div class="info-block__line">
      <span class="info-block__line-title">{{ $t('status') }}: </span>
      <span
        class="info-block__status"
        :style="{ color: info.formatedStatus.color }"
      >
        {{ info.formatedStatus.title }}
      </span>
    </div>
    <div v-if="info.date" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('date') }}: </span>
      <span class="info-block__date">
        {{ formatedDate }}
      </span>
    </div>
    <div v-if="type !== 'redelegation'" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('sendTo') }}: </span>
      <span class="info-block__line-to">
        {{ info.to }}
      </span>
    </div>
    <div v-if="type === 'redelegation'" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('sourceAddress') }}: </span>
      <span class="info-block__line-to">
        {{ info.validator_src_address }}
      </span>
    </div>
    <div v-if="type === 'redelegation'" class="info-block__line">
      <span class="info-block__line-title">
        {{ $t('destinationAddress') }}:
      </span>
      <span class="info-block__line-to">
        {{ info.validator_dst_address }}
      </span>
    </div>
    <div class="info-block__line">
      <span class="info-block__line-title"> {{ $t('amount') }}: </span>
      <div>
        <span
          v-pretty-number="{ value: info.value, currency: currentWallet?.code }"
          class="info-block__line-amount"
        />
        <span class="info-block__line-currency">
          {{ currentWallet?.code }}
        </span>
      </div>
    </div>
    <div v-if="info.comment" class="info-block__line">
      <span class="info-block__line-title"> {{ $t('memo') }}: </span>
      <span class="info-block__line-to">
        {{ info.comment }}
      </span>
    </div>
    <div v-if="info.hash" class="info-block__line" target="_blank">
      <div class="info-block__line-title">
        {{ $t('viewTranscasction')
        }}<a target="_blank" :href="txUrl"
          ><linkIcon class="info-block__link-icon"
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
import linkIcon from '@/assets/icons/link.svg';
import { format } from 'date-fns';
import { computed } from 'vue';

export default {
  name: 'InfoBlock',
  components: { linkIcon },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },

  setup(props) {
    const formatedDate = computed(() =>
      format(new Date(props.info.date), 'yyyy/MM/dd hh:mm:ss')
    );
    const txUrl = computed(() =>
      props.currentWallet?.getTxUrl(props.currentWallet.id, props.info.hash)
    );

    return { formatedDate, txUrl };
  },
};
</script>

<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  &__line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 8px;
    text-decoration: none;
    & svg {
      margin-left: 10px;
    }
    &:first-child {
      margin-top: 0;
    }
  }

  &__line-title {
    display: flex;
    align-items: center;
    padding-right: 20px;
    font-size: 14px;
    line-height: 30px;
    color: $gray;
  }
  &__date,
  &__status,
  &__line-to,
  &__line-currency {
    font-size: 14px;
    line-height: 30px;
    word-break: break-word;
  }
  &__status {
    font-family: 'Panton_Bold';
    text-transform: capitalize;
  }
  &__date {
    color: $mid-blue;
  }

  &__line-amount {
    font-family: 'Panton_Bold' !important;
    font-size: 16px;
    line-height: 19px;
    color: $blue;
    margin-right: 3px;
  }
  &__link-icon {
    width: 17px;
    height: 15px;
  }

  &__line-currency {
    color: $mid-gray;
  }
}
</style>
