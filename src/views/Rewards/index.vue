<template>
  <div class="rewards">
    <div v-if="data.rewards && !isLoading" class="rewards__main">
      <RewardsPlaceholder />
    </div>

    <div v-else class="rewards__main">
      <h4 class="rewards__main-title">
        {{ $t('rewardsPage.rewardsDetails') }}
      </h4>
      <div v-if="!data.rewards" class="rewards__controls">
        <TabsGroup
          v-model:currentValue="currentTab"
          :tabs="tabs"
          data-qa="rewards__period"
          @update:currentValue="currentTabChangeHandler"
        />
        <div v-if="currentTab === 'custom'" class="rewards__date-picker">
          <DatePicker
            v-model:date="date"
            expand
            @update:date="dateChangeHandler"
          />
        </div>
      </div>
      <div v-if="isLoading" class="rewards__loader">
        <Loading />
      </div>
      <RewardsPlaceholder
        v-if="
          (listData.length === 0 && !isLoading) || (data.rewards && !isLoading)
        "
      />
      <div
        v-if="!isLoading && !data.rewards && listData.length > 0"
        class="rewards__rewards"
      >
        <div class="rewards__total-for-range">
          <TotalForRange :total="total" />
        </div>
        <div class="rewards__rewards-list">
          <Dropdown v-for="item in listData" :key="item.net" :data="item" />
        </div>
      </div>
    </div>
    <div class="rewards__rigth-section">
      <div v-if="data.rewards" class="rewards__rigth-section-placholder">
        <RigthSectionPlaceholder />
      </div>
      <div class="rewards__rigth-section-block">
        <div v-if="!data.rewards" class="rewards__total-rewards">
          <TotalRewards
            :total-btc="totalRewardsInBTC"
            :total-usd="totalRewardsInUSD"
          />
        </div>
        <div v-if="totalForStakeBanner > 0" class="rewards__stake-banner">
          <StakeBanner :total="totalForStakeBanner" :date="stakeBannerDate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { ref, computed } from 'vue';
import { useWindowSize } from 'vue-window-size';
import moment from 'moment';
import BigNumber from 'bignumber.js';

import useWallets from '@/compositions/useWallets';
import { screenWidths } from '@/config/sreenWidthThresholds';

import Loading from '@/components/Loading.vue';
import DatePicker from '@/components/UI/DatePicker.vue';
import TabsGroup from '@/components/UI/TabsGroup';

import { getNetworkDataByKey } from '@/helpers/networkConfig';

import { tabsList, tabsListmd } from '@/static/dateTabs';

import RigthSectionPlaceholder from './components/RigthSectionPlaceholder.vue';
import RewardsPlaceholder from './components/RewardsPlaceholder.vue';
import StakeBanner from './components/StakeBanner.vue';
import TotalForRange from './components/TotalForRange.vue';
import TotalRewards from './components/TotalRewards.vue';
import Dropdown from './components/Dropdown.vue';

export default {
  name: 'Rewards',
  components: {
    TabsGroup,
    Dropdown,
    DatePicker,
    TotalRewards,
    Loading,
    TotalForRange,
    StakeBanner,
    RewardsPlaceholder,
    RigthSectionPlaceholder,
  },
  setup() {
    const store = useStore();
    const { width } = useWindowSize();
    const tabs = computed(() =>
      width.value < screenWidths.lg ? tabsListmd : tabsList
    );
    const currentTab = ref(1);
    const isLoading = ref(false);

    const totalForStakeBanner = computed(() => store.getters['rewards/total']);
    const stakeBannerDate = computed(() => store.getters['rewards/date']);

    const date = ref([]);

    const loadData = async (from, to) => {
      isLoading.value = true;
      await store.dispatch('rewards/getRewardsByRange', {
        from,
        to,
      });
      isLoading.value = false;
    };
    loadData(
      Date.now() - 1000 * 60 * 60 * 24 * 31 * currentTab.value,
      Date.now()
    );

    const data = computed(() => store.getters['rewards/rewardsByRange']);
    const networksConfig = computed(() => store.getters['networks/config']);

    const { wallets } = useWallets();

    const listData = computed(() => {
      const mixedData = [];
      const result = {};

      for (const item in data.value) {
        const [net, token] = item.split('_');
        let netKey = net;

        if (token && token !== 'xct') continue;
        else netKey = item;

        if (!result[netKey]) {
          result[netKey] = getNetworkDataByKey({
            config: networksConfig.value,
            network: netKey,
            key: 'allKeys',
          });
          result[netKey].rewards = [];
        }

        for (const reward in data.value[item]) {
          result[netKey].rewards.push({
            value: data.value[item][reward],
            address: reward,
          });
        }
      }

      for (const item in result) {
        mixedData.push(result[item]);
      }

      return mixedData
        .filter((item) => item.net)
        .sort((item, nextItem) => (item.name > nextItem.name ? 1 : -1));
    });

    const currency = computed(() => store.getters['profile/rates']);
    const total = computed(() => {
      return listData.value.reduce((total, currentValue) => {
        const totalForNet = currentValue.rewards.reduce(
          (total, currentValue) => {
            return BigNumber(total).plus(currentValue.value).toNumber();
          },
          0
        );

        // Нужно будет добавить цену для XCT
        const totalForNetInUsd =
          BigNumber(totalForNet)
            .times(currency.value[currentValue.net]?.USD)
            .toNumber() || 0;

        return BigNumber(total).plus(totalForNetInUsd).toNumber();
      }, 0);
    });

    const totalRewardsInBTC = computed(() => {
      return wallets.value.reduce((total, currentValue) => {
        const rewardInUsd = BigNumber(
          currentValue.balance?.claimableRewards || 0
        )
          .times(currency.value[currentValue.net].BTC)
          .toNumber();

        return BigNumber(total).plus(rewardInUsd).toNumber();
      }, 0);
    });

    const totalRewardsInUSD = computed(() =>
      BigNumber(totalRewardsInBTC.value)
        .times(currency.value?.btc.USD)
        .toNumber()
    );

    const formatFromTo = (month = null, from = null, to = null) => {
      const fromTime = !from ? new Date() : new Date(from);
      const toTime = !to ? new Date() : new Date(to);

      fromTime.setHours(0, 0, 0, 0);
      toTime.setHours(23, 59, 59, 59);

      if (month) fromTime.setMonth(fromTime.getMonth() - month);

      return {
        from: Number(fromTime),
        to: Number(toTime),
      };
    };

    const dateChangeHandler = (val) => {
      if (val.length > 0) {
        const { from, to } = formatFromTo(null, val[0], val[1]);
        loadData(from, to);
      }
    };

    const currentTabChangeHandler = async (val) => {
      if (val === 'all') {
        isLoading.value = true;
        await store.dispatch('rewards/getAllRewards');
        isLoading.value = false;
      } else if (val !== 'custom') {
        date.value = [];
        const { from, to } = formatFromTo(val);
        loadData(Number(from), Number(to));
      }
    };

    return {
      currentTabChangeHandler,
      dateChangeHandler,
      tabs,
      currentTab,
      listData,
      total,
      date,
      totalRewardsInBTC,
      totalRewardsInUSD,
      isLoading,
      moment,
      totalForStakeBanner,
      stakeBannerDate,
      data,
    };
  },
};
</script>

<style lang="scss" scoped>
.rewards {
  display: flex;
  flex: 1;
  height: calc(100vh - 114px);
  @include md {
    height: calc(100vh - 82px);
  }
  &__loader {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  &__rewards {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
    border-radius: 50px 50px 0px 0px;
    background: $white;
    margin-right: 29px;
    // padding: 40px 45px 51px 45px;
    @include lg {
      // padding: 40px 40px 25px 40px;
      border-radius: 25px 25px 0px 0px;
    }
    @include md {
      // padding: 24px 23px 0 24px;
      box-shadow: 0px 0px 25px rgba(106, 75, 255, 0.3);
      border-radius: 25px 25px 0px 0px;
      margin-right: 23px;
    }
  }
  &__rigth-section {
    width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @include lg {
      width: 240px;
    }
    @include md {
      width: 184px;
    }
  }
  &__rigth-section-placholder {
    width: 100%;
    height: 115px;
  }
  &__rigth-section-block {
    display: flex;
    flex-direction: column;
  }
  &__main-title {
    margin: 0px;
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 27px;
    font-family: 'Panton_Bold';
    padding: 40px 45px 0 45px;
    @include lg {
      padding: 40px 40px 0 40px;
      margin-bottom: 29px;
    }
    @include md {
      padding: 24px 23px 0 24px;
      margin-bottom: 29px;
    }
  }
  &__controls {
    display: flex;
    margin-bottom: 24px;
    padding: 0 45px 0 45px;
    @include lg {
      padding: 0 40px 0 40px;
      margin-bottom: 16px;
    }
    @include md {
      padding: 0 23px 0 24px;
      margin-bottom: 16px;
    }
  }
  &__date-picker {
    margin-left: 22px;
    @include lg {
      margin-left: 8px;
    }
    @include md {
      margin-left: 8px;
    }
  }
  &__total-for-range {
    display: flex;
    padding: 0 45px 0 45px;
    margin-bottom: 7px;
    @include lg {
      padding: 0 40px 0 40px;
    }
    @include md {
      padding: 0 23px 0 24px;
    }
  }
  &__total-rewards {
    width: 100%;
    height: 115px;
    margin-bottom: 30px;
    @include lg {
      height: 125px;
      margin-bottom: 20px;
    }
    @include md {
      mp: 16px;
      height: 125px;
    }
  }
  &__stake-banner {
    width: 100%;
    height: 200px;
  }
  &__rewards-list {
    display: flex;
    overflow-x: hidden;
    overflow-y: auto;
    flex-direction: column;
    flex: 1;
    padding: 24px 45px 0 45px;
    @include lg {
      padding: 16px 40px 0 40px;
    }
    @include md {
      padding: 16px 23px 0 24px;
    }
  }
}

body.dark {
  .rewards {
    &__main-title {
      color: $white;
    }

    .total-rewards {
      background: $dark-panel-bg;
    }

    &__main {
      background: $dark-panel-bg;
    }

    .rewards-placeholder {
      background: $dark-panel-bg;

      .rewards-placeholder__icon {
        border: 1px solid #4b4c63;
      }
    }
  }
}
</style>
