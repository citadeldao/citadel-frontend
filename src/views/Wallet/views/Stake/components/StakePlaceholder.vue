<template>
  <div class="stake-placeholder">
    <h2 class="stake-placeholder__title">
      {{ $t('stakePlaceholder.title') }}
    </h2>
    <div class="stake-placeholder__section">
      <Card class="card-special">
        <template #default>
          <span class="card-special-title">
            {{ $t('stakePlaceholder.whatIs') }}
          </span>
          <span class="card-special-title-staking">
            {{ isXct ? 'XCT' : $t('staking.staking') }}
          </span>
          <RoundArrowButton
            data-qa="stake__start-staking-button"
            :disabled="!canStake"
            @click="$emit('click:placeholder')"
          />
          <xctStakePlaceholderIcon
            v-if="isXct"
            class="card-special-icon card-special-icon--xct"
          />
          <specialCardIcon v-else class="card-special-icon" />
        </template>
      </Card>
      <Card>
        <template #icon>
          <div class="card-icon">
            <chooseNode v-if="isXct" />
            <chooseNodes v-else />
          </div>
        </template>
        <template #info>
          <span class="card-info">
            {{
              $t(
                isXct
                  ? 'xct.stakingPlaceholderCard1Info'
                  : 'stakePlaceholder.card1Info'
              )
            }}
          </span>
        </template>
      </Card>
      <Card>
        <template #default>
          <div class="card-icon">
            <stakeAmount />
          </div>
          <span class="card-info">
            {{ $t('stakePlaceholder.card2Info') }}
          </span>
        </template>
      </Card>
      <Card>
        <template #default>
          <div class="card-icon">
            <enjoy />
          </div>
          <span class="card-info">
            {{
              $t(
                isXct
                  ? 'xct.stakingPlaceholderCard3Info'
                  : 'stakePlaceholder.card3Info'
              )
            }}
          </span>
        </template>
      </Card>
    </div>
    <div class="stake-placeholder__button">
      <PrimaryButton :disabled="!canStake" @click="$emit('click:placeholder')">
        {{ $t('startStaking') }}
      </PrimaryButton>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';
import xctStakePlaceholderIcon from '@/assets/icons/xctStakePlaceholderIcon.svg';
import RoundArrowButton from '@/components/UI/RoundArrowButton';
import specialCardIcon from '@/assets/icons/special-card-icon.svg';
import enjoy from '@/assets/icons/enjoy.svg';
import chooseNodes from '@/assets/icons/choose-nodes.svg';
import chooseNode from '@/assets/icons/choose-node.svg';
import stakeAmount from '@/assets/icons/stake-amount.svg';
import PrimaryButton from '@/components/UI/PrimaryButton';
import Card from '@/components/UI/Card';
export default {
  name: 'StakePlaceholder',
  components: {
    PrimaryButton,
    chooseNodes,
    stakeAmount,
    enjoy,
    specialCardIcon,
    RoundArrowButton,
    xctStakePlaceholderIcon,
    chooseNode,
    Card,
  },
  props: {
    isXct: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click:placeholder'],
  setup() {
    const canStake = inject('canStake');

    return { canStake };
  },
};
</script>

<style lang="scss" scoped>
.card-special {
  padding: 16px 0 0 23px;
  &-title {
    font-size: 16px;
  }
  button {
    @include xl {
      top: 39px;
      right: 61px;
    }
    @include lg {
      top: 91px;
      right: 73px;
    }
    @include md {
      top: 23px;
      right: 16px;
    }
  }
}
.stake-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 84px 0 99px 0;

  @include lg {
    padding: 44px 0 95px 0;
  }
  @include md {
    padding: 17px 0 28px 0;
  }

  &__title {
    margin: 0;
    font-family: 'Panton_Bold';
    font-size: 30px;
    line-height: 30px;
    margin-bottom: 35px;
    @include lg {
      font-size: 20px;
      line-height: 27px;
      margin-bottom: 23px;
    }
    @include md {
      font-size: 16px;
      line-height: 27px;
      margin-bottom: 17px;
    }
  }

  &__section {
    display: flex;
    margin-bottom: 47px;
    justify-content: center;
    @include lg {
      margin-bottom: 33px;
    }
    @include md {
      margin-bottom: 0;
      flex-wrap: wrap;
      gap: 16px;
      width: 470px;
    }
  }

  &__card {
    border-radius: 16px;
    width: 255px;
    height: 211px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 33px 42px;
    align-items: center;
    margin-right: 24px;
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
  }

  &__card-special {
    border-radius: 16px;
    width: 257px;
    height: 211px;
    position: relative;
    display: flex;
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
    }
  }

  &__card-special-title {
    font-family: 'Panton_Bold';
    font-size: 16px;
    line-height: 30px;
    @include md {
      font-size: 16px;
      line-height: 25px;
    }
  }

  &__card-special-title-staking {
    font-family: 'Panton_ExtraBold';
    font-size: 27px;
    line-height: 30px;
    @include md {
      font-size: 25px;
      line-height: 25px;
    }
  }

  &__card-special-icon {
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

  &__card-icon {
    width: 72px;
    height: 72px;
    border-radius: $round;
    background: $dark-blue;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 29px;
    flex-shrink: 0;

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

  &__card-info {
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

  &__button {
    @include md {
      display: none;
    }
  }
}
</style>
