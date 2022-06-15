<template>
  <div class="content__wrap">
    <div class="content__amount">
      <div class="amount__title">Amount</div>
      <div class="amount__prev">
        {{ amount }}
        <span class="content__currency">{{ currency }}</span>
      </div>
      <div class="content__symbol">
        <arrowRigth />
      </div>
      <div class="amount__next">
        {{ amountNext }}
        <span class="content__currency">{{ currency }}</span>
      </div>
    </div>
    <div class="content__fee">
      <div class="fee__title">Fee</div>
      <div class="fee__prev">
        {{ feePrev }}
        <span class="content__currency">{{ currency }}</span>
      </div>
      <div class="content__symbol">
        <arrowRigth />
      </div>
      <div class="fee__next">
        {{ fee }}
        <span class="content__currency">{{ currency }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import arrowRigth from '@/assets/icons/arrow-rigth.svg';

export default {
  name: 'ChangingModalContent',
  components: { arrowRigth },
  props: {
    currency: {
      type: String,
    },
    amount: {
      type: Number,
    },
    amountNext: {
      type: Number,
    },
    feePrev: {
      type: Number,
    },
    fee: {
      type: Number,
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  &__wrap {
    padding-top: 15px;
    width: 100%;
  }
  &__symbol {
    margin: 0 15px;
    svg {
      height: 14px;
    }
  }
  &__currency {
    font-weight: 400;
    color: #afbccb;
  }
  &__amount {
    display: flex;
    justify-content: space-between;
    margin-bottom: 13px;
  }
  &__fee {
    display: flex;
    justify-content: space-between;
  }
}

.amount {
  &__title {
    flex: 1 1 auto;
    font-weight: 600;
  }

  &__next,
  &__prev {
    font-weight: 700;
    color: #1a53f0;
  }
}

.fee {
  &__title {
    flex: 1 1 auto;
    font-weight: 600;
  }
  &__next,
  &__prev {
    font-weight: 700;
    color: #fa3b33;
  }
}
</style>
