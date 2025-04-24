<template>
  <div class="stake-nodes-status">
    <!-- available -->
    <div class="stake-nodes-status__item available">
      <div class="col">
        <div class="icon available">
          <keep-alive :style="{ fill: '#AEBCCA' }">
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="label">Available balance</div>
      </div>
      <div class="col">
        <div class="balance">
          <span
            v-pretty-number="{
              value: !showBalance ? HIDE_BALANCE_MASK : availableBalance,
              currency: symbol,
            }"
          />
          <span class="symbol">{{ symbol }}</span>
        </div>
      </div>
    </div>
    <!-- staked -->
    <div v-if="stakeBalance" class="stake-nodes-status__item">
      <div class="col">
        <div class="icon">
          <keep-alive :style="{ fill: '#FF5722' }">
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="label">Staked balance</div>
      </div>
      <div class="col">
        <div class="balance">
          <span
            v-pretty-number="{
              value: !showBalance ? HIDE_BALANCE_MASK : stakeBalance,
              currency: symbol,
            }"
          />
          <span class="symbol">{{ symbol }}</span>
        </div>
      </div>
    </div>
    <!-- nft -->
    <div v-if="nftBalance" class="stake-nodes-status__item nft">
      <div class="col">
        <div class="icon nft">
          <keep-alive :style="{ fill: '#4B9A43' }">
            <component :is="currentIcon" />
          </keep-alive>
        </div>
        <div class="label">Nft balance</div>
      </div>
      <div class="col">
        <div class="balance">
          <span
            v-pretty-number="{
              value: !showBalance ? HIDE_BALANCE_MASK : nftBalance,
              currency: symbol,
            }"
          />
          <span class="symbol">{{ symbol }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, markRaw } from 'vue';
import { HIDE_BALANCE_MASK } from '@/helpers/prettyNumber';
import { useStore } from 'vuex';

export default {
  components: {},
  props: {
    stakeBalance: {
      required: true,
    },
    availableBalance: {
      required: true,
    },
    nftBalance: {
      required: true,
    },
    symbol: {
      required: true,
    },
  },
  setup() {
    const currentIcon = ref('');
    const store = useStore();
    const showBalance = store.getters['balance/showBalance'];

    import(`@/assets/icons/networks/citadel.svg`).then((val) => {
      currentIcon.value = markRaw(val.default);
    });

    return {
      currentIcon,
      HIDE_BALANCE_MASK,
      showBalance,
    };
  },
};
</script>
<style lang="scss" scoped>
.stake-nodes-status {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;

  @include xl {
    flex-direction: row;

    .stake-nodes-status__item.available {
      margin-right: 20px;
    }
  }

  &__item {
    width: 100%;
    height: 68px;
    border-radius: 8px;
    border: 1px solid #c3ceeb;
    margin-bottom: 20px;
    padding: 0 12px 0 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.available {
      background-color: #f9faff;
    }

    .col {
      display: flex;
      align-items: center;
    }

    .icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 15px;
      background-color: #fff;
      border: 8px solid #ff5722;
      display: flex;
      justify-content: center;
      align-items: center;

      svg {
        width: 16px;
        height: 16px;
      }

      &.available {
        border: 8px solid #afbccb;
      }

      &.nft {
        border: 8px solid #4b9a43;
      }
    }

    .label {
      font-size: 17px;
      font-family: Panton_Bold;
      color: #000;
    }

    .balance {
      font-size: 17px;
      font-family: Panton_SemiBold;
      color: $dark-blue;

      span.symbol {
        color: #000;
      }
    }
  }
}

body.dark {
  .stake-nodes-status {
    &__item {
      border: 1px solid #4b4c63;

      &.available {
        background: #1b1c31;
        border: 1px solid #4b4c63;
      }

      .label {
        color: #fff;
      }

      .balance {
        background-color: transparent;
      }

      .balance span.symbol {
        color: #8b9bc7;
      }
    }
  }
}
</style>
