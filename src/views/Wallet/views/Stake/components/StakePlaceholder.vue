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
    top: 39px;
    right: 61px;
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
}
</style>
