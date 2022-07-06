<template>
  <div class="card">
    <slot name="icon" class="card-icon"></slot>
    <slot name="info" class="card-info"></slot>
    <slot name="default"> </slot>
    <img
      v-if="iconName"
      class="card-special-icon--special"
      :src="require(`@/assets/images/${iconName}.png`)"
    />
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: {
    iconName: {
      type: String,
    },
  },
};
</script>
<style lang="scss">
.card {
  border-radius: 16px;
  width: 255px;
  height: 211px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 33px 42px;
  align-items: center;
  margin-right: 24px;
  &-icon {
    width: 72px;
    height: 72px;
    border-radius: $round;
    background: $dark-blue;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 29px;

    & svg {
      width: 36px;
      height: 36px;
      @include md {
        width: 24px;
        height: 24px;
      }
    }

    @include lg {
      margin-bottom: 15px;
    }
    @include md {
      margin-bottom: 0;
      width: 54px;
      height: 54px;
      margin-right: 10px;
    }
  }
  @include lg {
    width: 138px;
    height: 180px;
    padding: 27px 6px 22px 6px;
    margin-right: 4px;
  }
  @include md {
    border-radius: 8px;
    width: 227px;
    height: 80px;
    flex-direction: row;
    margin-right: 0;
    padding: 0 12px 0 14px;
    align-items: center;
  }

  &:last-child {
    margin-right: 0;
  }

  &::after {
    content: '';
    opacity: 0.1;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $ligth-blue;
    position: absolute;
    border-radius: 16px;
  }
  &-info {
    font-size: 16px;
    line-height: 21px;
    text-align: center;
    color: $mid-blue;
    font-family: 'Panton_SemiBold';
    @include lg {
      font-size: 14px;
      line-height: 21px;
    }
    @include md {
      font-size: 14px;
      line-height: 20px;
      width: 137px;
      text-align: left;
    }
  }
  &-special {
    border-radius: 16px;
    width: 257px;
    height: 211px;
    position: relative;
    display: flex;
    align-items: baseline;
    flex-direction: column;
    padding: 16px 0 0 23px;
    margin-right: 24px;
    background-color: $white;
    background-image: url('~@/assets/images/cardWave.jpg');
    background-repeat: no-repeat;
    background-position: center bottom;
    box-shadow: 0 15px 50px rgba(80, 100, 124, 0.1),
      0 10px 15px rgba(80, 100, 124, 0.16);
    @include lg {
      width: 140px;
      height: 180px;
      background-image: url('~@/assets/images/cardWave-lg.jpg');
      padding: 11px 0 0 19px;
      margin-right: 4px;
    }
    @include md {
      border-radius: 8px;
      width: 227px;
      height: 80px;
      margin-right: 0;
      padding: 15px 0 0 26px;
      background-image: url('~@/assets/images/cardWave-md.jpg');
    }
    &__card &__button {
      @include md {
        display: none;
      }
    }
    & button {
      position: absolute;
      top: 39px;
      right: 61px;
      @include lg {
        top: 91px;
        right: 73px;
      }
      @include md {
        top: 23px;
        right: 16px;
      }
      z-index: 1;
    }
    &-title {
      font-family: 'Panton_Bold';
      font-size: 16px;
      line-height: 30px;
      @include md {
        font-size: 16px;
        line-height: 25px;
      }
      &-staking {
        font-family: 'Panton_ExtraBold';
        font-size: 30px;
        line-height: 30px;
        @include md {
          font-size: 24px;
          line-height: 24px;
        }
      }
    }
    &-icon {
      display: none;
      position: absolute;
      bottom: 11px;
      right: 11px;

      &--xct {
        bottom: 0;
        right: 14px;
      }

      @include xl {
        display: initial;
      }
    }
    &-icon--special {
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 100%;
      border-radius: 16px;

      @include xl {
        display: initial;
      }
      @include md {
        border-radius: 8px;
      }
    }
    &::after {
      display: none;
    }
  }
}
</style>
