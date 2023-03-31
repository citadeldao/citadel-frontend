<template>
  <div class="balance-struct">
    <div class="balance-struct_top">
      <div
        class="balance-struct__dot"
        :style="{ 'background-color': item.color }"
      />
      <div class="balance-struct__title-wrapper">
        <p class="balance-struct__title">
          {{ shortNameCrypto(item.name) }}
        </p>
        <div>
          <span
            v-pretty-number="{ value: item.percent, currency: '%' }"
            class="balance-struct__percent"
          />
          <span class="balance-struct__percent-sign">%</span>
        </div>
      </div>
    </div>

    <div v-if="item.balance" class="balance-struct__balance-wrapper">
      <div>
        <span
          v-pretty-number="{ value: item.balance, currency: item.code }"
          class="balance-struct__balance"
        />
        <span class="balance-struct__code">{{ item.code }}</span>
      </div>
      <div>
        <span
          v-pretty-number="{ value: BTC, currency: 'BTC' }"
          class="balance-struct__balance"
        />
        <span class="balance-struct__code">BTC</span>
      </div>
      <div>
        <span
          v-pretty-number="{ value: USD, currency: 'USD' }"
          class="balance-struct__balance"
        />
        <span class="balance-struct__code">USD</span>
      </div>
    </div>

    <!-- <span v-if="item.balance" class="balance-struct__balance-divider">/</span> -->
    <!-- <div class="balance-struct__balance-wrapper balance-struct__common-balance-wrapper"></div> -->
  </div>
</template>
<script>
import { computed } from 'vue';
import { shortNameCrypto } from '@/helpers';

export default {
  name: 'BalanceStructureExpandedItem',
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const BTC = computed(() => props.item.btc);
    const USD = computed(() => props.item.usd);

    return {
      shortNameCrypto,
      BTC,
      USD,
    };
  },
};
</script>
<style lang="scss" scoped>
.balance-struct {
  border: 1px dashed #bcc2d8;
  border-radius: 4px;

  flex: 0 49%;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  font-size: 14px;
  padding: 15px 20px;

  &_top {
    display: flex;
    align-items: center;
    width: 60%;
    margin-right: auto;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 10px;
  }
  &__title-wrapper {
    display: flex;
    align-items: flex-start;
    flex-direction: column-reverse;
  }

  &__title {
    font-family: 'Panton_SemiBold';
    font-weight: bold;
    color: $black;
    margin: 5px 0 0;
  }

  &__percent {
    font-size: $h4-size;
    color: $dark-blue;
    font-weight: 700;
    font-family: 'Panton_Regular' !important;
  }

  &__percent-sign {
    font-weight: 400;
    color: $mid-gray;
  }

  &__balance-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 40%;
    & > div {
      text-align: right;
    }
  }

  &__balance {
    color: $dark-blue;
    font-weight: bold;
  }

  &__code {
    display: inline-block;
    font-weight: 400;
    color: $mid-gray;
    width: 50px;
    text-align: left;
    margin-left: 5px;
  }
}
</style>
