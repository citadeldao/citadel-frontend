<template>
  <div class="send-fee-change">
    <div
      v-for="(label, ndx) in Object.keys(feeInfo)"
      :key="ndx"
      class="send-fee-change__item"
      @click="changeFee(label, ndx)"
    >
      <div class="indicator">
        <div class="check" v-if="selectedFeeIndex === ndx" />
      </div>
      <div class="info">
        <div class="label">{{ label }}</div>
        <span
          v-pretty-number="{
            value: feeInfo[label]?.fee,
            currency: wallet?.parentCoin?.code || wallet.code,
          }"
          class="value"
        />
        <span class="value">{{ wallet?.parentCoin?.code || wallet.code }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'SendFee',
  props: {
    feeInfo: {
      required: true,
    },
    wallet: {
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedFeeIndex = ref(0);

    const changeFee = (label, ndx) => {
      selectedFeeIndex.value = ndx;
      emit('changeFee', label);
    };

    onMounted(() => {
      emit('changeFee', Object.keys(props.feeInfo)[0]);
    });

    return {
      selectedFeeIndex,
      changeFee,
    };
  },
};
</script>
<style lang="scss" scoped>
.send-fee-change {
  display: flex;
  align-items: center;
  margin-top: 10px;

  &__item {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    min-width: 110px;

    .indicator {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid #c3ceeb;
      display: flex;
      justify-content: center;
      align-items: center;

      .check {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #1a53f0;
      }
    }

    .info {
      margin-left: 5px;
    }

    .label {
      font-family: Panton_Regular;
      text-transform: capitalize;
      font-size: 14px;
    }

    .value {
      margin-top: 3px;
      color: #afbccb;
      font-family: Panton_Regular;
      font-size: 12px;
    }
  }
}
</style>
