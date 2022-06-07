<template>
  <div
    class="stake-banner"
    :style="data"
  >
    <div class="stake-banner__info">
      <div class="stake-banner__info-section">
        <div class="stake-banner__info-title">
          <span class="stake-banner__info-title-title">
            {{ $t("rewardsPage.rewardsReport") }}
          </span>
          <div class="stake-banner__date-range">
            <span class="stake-banner__info-title-date-range-from">
              {{ moment(date.from).format("DD MMM") }}
            </span>
            -
            <span class="stake-banner__info-title-date-range-to">
              {{ moment(date.to).format("DD MMM") }}
            </span>
          </div>
        </div>
        <p
          class="stake-banner__text"
          v-html="text"
        />
      </div>

      <div class="stake-banner__reward">
        <span
          v-pretty-number="{value: total, currency: '$'}"
          class="stake-banner__reward-value"
        />
        <span class="stake-banner__reward-currency">$</span>
      </div>
    </div>
    <img
      class="stake-banner__image stake-banner__image--xl"
      :src="require(`@/assets/images/${data.name}.png`)"
    >
    <img
      class="stake-banner__image stake-banner__image--lg"
      :src="require(`@/assets/images/${data.lg}.png`)"
    >
    <img
      class="stake-banner__image stake-banner__image--md"
      :src="require(`@/assets/images/${data.md}.png`)"
    >
    <div class="stake-banner__staek-count">
      {{ `x${data.value}` }}
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { computed } from '@vue/runtime-core';
export default {
  name: 'StakeBanner',
  props: {
    total: {
      type: [String, Number],
      default: 0,
    },
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const data = computed(() => {
      if (props.total < 1) {
        return {
          name: 'bananas',
          value: 1,
          '--gradient': 'linear-gradient(90deg, #FC4A1A 0%, #F7B733 100%)',
          md: 'bananasmd',
          lg: 'bananaslg',
        };
      } else if (props.total < 10) {
        return {
          name: 'coke',
          value: Math.round(props.total),
          '--gradient': 'linear-gradient(90deg, #9400D3 0%, #4B0082 100%)',
          md: 'cokemd',
          lg: 'cokelg',
        };
      } else if (props.total < 100) {
        return {
          name: 'pizza',
          value: Math.round(props.total / 10),
          '--gradient':
            'linear-gradient(90deg, #00416A 0%, #799F0C 50%, #FFE000 100%)',
          md: 'pizzamd',
          lg: 'pizzalg',
        };
      } else if (props.total < 1000) {
        return {
          name: 'trip',
          value: Math.round(props.total / 100),
          '--gradient': 'linear-gradient(90deg, #4776E6 0%, #8E54E9 100%)',
          md: 'tripmd',
          lg: 'triplg',
        };
      } else if (props.total < 10000) {
        return {
          name: 'iphone',
          value: Math.round(props.total / 1000),
          '--gradient': 'linear-gradient(90deg, #EC008C 0%, #FC6767 100%)',
          md: 'iphonemd',
          lg: 'iphonelg',
        };
      } else if (props.total < 100000) {
        return {
          name: 'watches',
          value: Math.round(props.total / 10000),
          '--gradient':
            'linear-gradient(90deg, #EB0000 0%, #95008A 50%, #3300FC 100%)',
          md: 'watchesmd',
          lg: 'watcheslg',
        };
      }

      return {
        name: 'car',
        value: Math.round(props.total / 100000),
        '--gradient': 'linear-gradient(90deg, #D31027 0%, #EA384D 100%)',
        md: 'carmd',
        lg: 'carlg',
      };

    });
    const text = computed(() => {
      if (data.value.name !== 'trip') {
        return `You could have bought some <strong>${data.value.name}</strong> with your claimed tokens`;
      }

      return `You could fly <strong> Paris → Rome</strong> with your claimed tokens`;

    });

    return { data, moment, text };
  },
};
</script>

<style lang="scss" scoped>
.stake-banner {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-image: var(--gradient);
  padding: 27px 0 28px 34px;
  @include lg {
    padding: 27px 0 28px 26px;
  }
  @include md {
    padding: 27px 0 28px 26px;
  }
  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  &____info-section {
    display: flex;
    flex-direction: column;
  }
  &__info-title {
    font-size: 20px;
    line-height: 24px;
    color: $white;
    display: flex;
    flex-direction: column;
    @include lg {
      flex-direction: row;
      font-size: 14px;
      line-height: 17px;
    }
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__info-title-date-range-from,
  &__info-title-title,
  &__info-title-date-range-to {
    font-family: "Panton_Bold";
  }
  &__info-title-title {
    @include lg {
      margin-right: 5px;
    }
  }
  &__text {
    font-size: 12px;
    line-height: 14px;
    color: $white;
    font-family: "Panton_Light";
    margin: 0;
    width: 176px;
    margin-top: 7px;
    @include md {
      width: 140px;
    }
  }
  &__reward {
    display: flex;
  }
  &__reward-value,
  &__reward-currency {
    font-size: 25px;
    line-height: 23px;
    font-family: "Panton_Bold" !important;
    color: $white;
    z-index: 1;
    @include md {
      font-size: 22px;
      line-height: 23px;
    }
  }

  &__image {
    position: absolute;
    right: 0px;
    bottom: 0px;
    display: none;
    &--xl {
      @include xl {
        display: initial;
      }
    }
    &--lg {
      @include lg {
        display: initial;
      }
    }
    &--md {
      @include md {
        display: initial;
      }
    }
  }
  &__staek-count {
    position: absolute;
    width: 42px;
    height: 42px;
    border-radius: $round;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $crimson;
    font-size: 20px;
    line-height: 23px;
    font-family: "Panton_Bold";
    color: $white;
    bottom: 22px;
    right: 80px;
    @include lg {
      bottom: 9px;
      right: 71px;
    }
    @include md {
      bottom: 9px;
      right: 10px;
    }
  }
}
</style>