<template>
  <div
    class="claim-unstaked"
    :class="{'claim-unstaked--public': isPublic}"
  >
    <div class="claim-unstaked__wave">
      <blueWave v-if="isPublic" />
      <violetWave v-else />
    </div>
    <div
      v-if="isPublic"
      class="claim-unstaked__lock"
    >
      <claimBlockLock fill="#4CD9ED" />
    </div>
    <div class="claim-unstaked__main">
      <div class="claim-unstaked__left">
        <div class="claim-unstaked__title">
          {{ $t('unstakedBalance') }}
        </div>
        <div class="claim-unstaked__sec-title">
          {{ $t('claimUnstakedText') }}
        </div>
        <div class="claim-unstaked__amount">
          <div
            v-pretty-number="walletInfo?.balance?.unstake"
            class="claim-unstaked__value"
          />
          <div class="claim-unstaked__cur">
            {{ code }}
          </div>
        </div>
      </div>
      <div class="claim-unstaked__right">
        <RoundArrowButton
          v-if="!isPublic"
          :bg-color="'#6A4BFF'"
          :icon-fill="'white'"
          @click="$emit('prepareUnstakedClaim')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import violetWave from '@/assets/icons/violet-wave.svg';
import blueWave from '@/assets/icons/blue-wave.svg';
import claimBlockLock from '@/assets/icons/claim-block-lock.svg';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import { WALLET_TYPES } from '@/config/walletType';
import { computed } from 'vue';

export default {
  name: 'ClaimUnstakedBlock',
  components: {
    violetWave,
    RoundArrowButton,
    blueWave,
    claimBlockLock,
  },
  props: {
    code: {
      type: [Number, String],
      default: '',
    },
    walletInfo: {
      type: Object,
      default: () => ({}),
    },
    walletType: {
      type: String,
      default: '',
    },
  },
  emits: ['prepareUnstakedClaim'],
  setup(props) {
    const isPublic = computed(() => props.walletType === WALLET_TYPES.PUBLIC_KEY);

    return {
      isPublic,
    };
  },
};
</script>
<style lang="scss" scoped>
.claim-unstaked {
    height: 150px;
    border-radius: 16px;
    background-color: $violetBackground;
    width: 100%;
    position: relative;
    overflow: hidden;
    &--public {
      background-color: $lightBlueBackground;
      .claim-unstaked__sec-title {
        color: $blue;
      }
      .claim-unstaked__value {
        color: $blue;
      }
    }
    &__wave {
      width: 100%;
      opacity: 0.1;
      position: absolute;
      bottom: -5px;
      z-index: 0;
    }
    &__lock {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      width: 60px;
      opacity: 0.3;
    }
    &__main {
      display: flex;
      justify-content: center;
      position: relative;
      padding: 24px 27px 24px 24px;
      z-index: 1;
    }
    &__left {
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
    }
    &__right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      width: 48px;
    }
    &__title {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 5px;
    }
    &__sec-title {
      font-size: 14px;
      color: $dark-blue;
      margin-bottom: 5px;
      @include md {
        font-size: 13px;
      }
    }
    &__amount {
      display: flex;
      align-items: baseline;
    }
    &__value {
      font-weight: bold;
      font-size: 24px;
      color: $dark-blue;
    }
    &__cur {
      margin-left: 5px;
      font-size: 16px;
    }
}

</style>
