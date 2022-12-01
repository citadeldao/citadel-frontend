<template>
  <div id="rewardsBlockExpand" class="rewards-block-expand">
    <teleport v-if="isLoading" to="body">
      <Modal>
        <Loading />
      </Modal>
    </teleport>
    <div
      class="rewards-block-expand__close-icon"
      @click="$emit('close', $event)"
    >
      <constrictIcon class="constrict__icon" />
    </div>
    <div class="rewards-block-expand__header">
      <span class="rewards-block-expand__header-title">
        {{ $t('rewardDetails.title') }}
      </span>
      <span class="rewards-block-expand__header-subtitle">
        {{ $t('rewardDetails.subtitle') }}
      </span>
    </div>
    <div class="rewards-block-expand__controls">
      <TabsGroup
        v-model:currentValue="currentTab"
        class="rewards-block-expand__tabs"
        :tabs="tabs"
        @update:currentValue="currentTabChangeHandler"
      />
      <div
        v-if="currentTab === 'custom'"
        class="rewards-block-expand__date-picker"
      >
        <DatePicker
          v-model:date="date"
          expand
          @update:date="dateChangeHandler"
        />
      </div>
    </div>
    <table class="rewards-block-expand__table">
      <tr>
        <th class="rewards-block-expand__table-header--main">
          <span>
            {{ $t('rewards') }}
          </span>
        </th>
        <th
          class="rewards-block-expand__table-header rewards-block-expand__table-header--total-staked"
        >
          {{ $t('rewardDetails.totalStaked') }}
        </th>
        <th
          class="rewards-block-expand__table-header rewards-block-expand__table-header--citadel-staked"
          v-html="$t('rewardDetails.stakedOnCitadel')"
        />
        <th class="rewards-block-expand__table-header">
          {{ $t('rewardsPage.totalRewards') }}
        </th>
      </tr>
      <tr :style="{ borderBottom: '1px dashed #00A3FF' }">
        <th
          class="rewards-block-expand__table-title rewards-block-expand__table-title--xct"
        >
          XCT
        </th>
        <td
          class="rewards-block-expand__table-cell-total-staked rewards-block-expand__table-title--xct"
        >
          <span
            v-pretty-number="{
              value: currentWallet?.tokenBalance?.stake,
              currency: 'XCT',
            }"
            class="rewards-block-expand__table-cell-total-staked-amount"
          />
          <span class="rewards-block-expand__table-cell-total-staked-currency">
            XCT
          </span>
        </td>
        <td
          class="rewards-block-expand__table-cell-citadel-staked rewards-block-expand__table-title--xct"
        >
          <span
            v-pretty-number="{
              value: tableData.stakedCitadel.xct,
              currency: 'XCT',
            }"
            class="rewards-block-expand__table-cell-citadel-staked-amount"
          />
          <span
            class="rewards-block-expand__table-cell-citadel-staked-currency"
          >
            XCT
          </span>
        </td>
        <td
          class="rewards-block-expand__table-cell-total-rewards rewards-block-expand__table-title--xct"
        >
          <span
            v-pretty-number="{ value: tableData.total.xct, currency: 'XCT' }"
            class="rewards-block-expand__table-cell-total-rewards-amount"
          />
          <span class="rewards-block-expand__table-cell-total-rewards-currency">
            XCT
          </span>
        </td>
      </tr>
      <tr>
        <th
          class="rewards-block-expand__table-title rewards-block-expand__table-title--other"
        >
          {{ $t('otherAssets') }}
        </th>
        <td
          class="rewards-block-expand__table-cell-total-staked rewards-block-expand__table-title--other"
        >
          <span class="rewards-block-expand__table-cell-total-staked-currency">
            $
          </span>
          <span
            v-pretty-number="{
              value: tableData.stakedOnOtherAssets,
              currency: '$',
            }"
            class="rewards-block-expand__table-cell-total-staked-amount"
          />
        </td>
        <td
          class="rewards-block-expand__table-cell-citadel-staked rewards-block-expand__table-title--other"
        >
          <span
            class="rewards-block-expand__table-cell-citadel-staked-currency"
          >
            $
          </span>
          <span
            v-pretty-number="{
              value: tableData.stakedCitadel.other,
              currency: '$',
            }"
            class="rewards-block-expand__table-cell-citadel-staked-amount"
          />
        </td>
        <td
          class="rewards-block-expand__table-cell-total-rewards rewards-block-expand__table-title--other"
        >
          <span
            v-pretty-number="{ value: tableData.total.other, currency: 'XCT' }"
            class="rewards-block-expand__table-cell-total-rewards-amount"
          />
          <span class="rewards-block-expand__table-cell-total-rewards-currency">
            XCT
          </span>
        </td>
      </tr>
    </table>
    <div class="rewards-block-expand__rewards-list">
      <Dropdown
        v-for="item in rewardsList"
        :key="item.net"
        :data="item"
        opened
      />
    </div>
  </div>
</template>

<script>
import Modal from '@/components/Modal';
import Loading from '@/components/Loading';
import Dropdown from '@/views/Rewards/components/Dropdown.vue';
import constrictIcon from '@/assets/icons/network-info/constrict.svg';
import DatePicker from '@/components/UI/DatePicker.vue';
import TabsGroup from '@/components/UI/TabsGroup';
import { tabsList, tabsListmd } from '@/static/dateTabs';
import { computed, ref } from '@vue/reactivity';
import moment from 'moment';
import notify from '@/plugins/notify';
import { useWindowSize } from 'vue-window-size';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { useStore } from 'vuex';
export default {
  name: 'RewardsBlockExpand',
  components: {
    constrictIcon,
    DatePicker,
    TabsGroup,
    Dropdown,
    Loading,
    Modal,
  },
  props: {
    tableData: {
      type: Object,
      default: () => {},
    },
    currentWallet: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['close'],
  setup(props) {
    const isLoading = ref(false);
    const currentTab = ref(1);
    const date = ref([]);
    const store = useStore();
    const { width } = useWindowSize();
    const tabs = computed(() =>
      width.value < screenWidths.lg ? tabsListmd : tabsList
    );
    const rewards = computed(() => store.getters['dao/rewards']);
    const networks = computed(() => store.getters['networks/networksList']);
    const rewardsList = computed(() =>
      rewards.value
        .reduce((accum, item) => {
          const netIndex = accum.findIndex(({ net }) => net === item.net);
          const rewards = { address: item.address, value: item.rewards };
          let newAccum = accum;

          if (netIndex !== -1) {
            newAccum[netIndex].rewards = [...accum[netIndex].rewards, rewards];
          } else {
            newAccum = [
              ...accum,
              {
                ...networks.value.find((network) => network.net === item.net),
                code: 'XCT',
                rewards: [rewards],
              },
            ];
          }

          return newAccum;
        }, [])
        .sort((item, nextItem) => (item.name > nextItem.name ? 1 : -1))
    );
    const loadData = async (from, to) => {
      isLoading.value = true;
      await store.dispatch('dao/getDaoRewardsByRange', {
        walletId: props.currentWallet.id,
        from,
        to,
      });
      isLoading.value = false;
    };
    loadData(Date.now() - 86400000 * 31 * currentTab.value, Date.now());
    const dateChangeHandler = async (val) => {
      if (val.length > 0) {
        if (+moment(val[0]).format('x') > +moment().format('x')) {
          notify({
            type: 'warning',
            text: 'Incorrect Date',
          });
        } else {
          await loadData(
            moment(val[0]).format('x'),
            moment(val[1]).format('x')
          );
        }
      }
    };
    const currentTabChangeHandler = async (val) => {
      if (val === 'all') {
        isLoading.value = true;
        await store.dispatch('dao/getAllDaoRewards', {
          address: props.currentWallet.address,
          walletId: props.currentWallet.id,
        });
        isLoading.value = false;
      } else if (val !== 'custom') {
        date.value = [];
        await loadData(Date.now() - 86400000 * 31 * val, Date.now());
      }
    };

    return {
      currentTab,
      tabs,
      currentTabChangeHandler,
      date,
      dateChangeHandler,
      rewardsList,
      isLoading,
    };
  },
};
</script>

<style lang="scss" scoped>
.rewards-block-expand {
  width: 982px;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: $white;
  padding: 51px 0;
  box-shadow: 15px 15px 15px rgba(63, 54, 137, 0.2);
  border-radius: 16px;
  @include lg {
    width: 709px;
    padding: 43px 0 41px 0;
  }
  @include md {
    width: 578px;
    padding: 21px 0 26px 0;
  }
  &__close-icon {
    height: auto;
    cursor: pointer;
    position: absolute;
    top: 45px;
    right: 45px;
    @include lg {
      top: 37px;
      right: 42px;
    }
    @include md {
      top: 20px;
      right: 24px;
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    margin: 0 45px 31px 45px;
    @include lg {
      margin: 0 40px 31px 40px;
    }
    @include md {
      margin: 0 24px 15px 24px;
    }
  }
  &__header-title {
    font-size: 20px;
    line-height: 30px;
    font-family: 'Panton_Bold';
    @include md {
      margin-bottom: 4px;
      font-size: 16px;
      line-height: 19px;
    }
  }
  &__header-subtitle {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
  }
  &__controls {
    display: flex;
    justify-content: flex-start;
    margin: 0 45px 36px 45px;
    @include lg {
      margin: 0 40px 36px 40px;
    }
    @include md {
      margin: 0 24px 21px 24px;
    }
  }
  &__tabs {
    margin-right: 16px;
    @include lg {
      margin-right: 8px;
    }
    @include md {
      margin-right: 13px;
    }
  }
  &__table {
    border-collapse: collapse;
    margin: 0 45px 25px 45px;
    @include lg {
      margin: 0 40px 22px 40px;
    }
    @include md {
      margin: 0 24px 15px 24px;
    }
  }
  &__table-header {
    font-size: 14px;
    line-height: 17px;
    color: $mid-blue;
    &--main {
      padding-bottom: 11px;
      font-size: 18px;
      line-height: 22px;
      color: $too-dark-blue;
      font-family: 'Panton_Bold';
      width: 307px;
      @include lg {
        width: 178px;
      }
      @include md {
        padding-bottom: 5px;
        font-size: 16px;
        line-height: 19px;
        width: 136px;
      }
    }
    &--total-staked {
      font-weight: normal;
      width: 213px;
      @include lg {
        width: 145px;
      }
      @include md {
        width: 125px;
      }
    }
    &--citadel-staked {
      width: 250px;
      font-weight: normal;
      @include lg {
        width: 160px;
      }
      @include md {
        width: initial;
      }
    }
  }
  & th,
  & td {
    text-align: left;
    &:last-child {
      text-align: right;
      @include md {
        text-align: left;
      }
    }
  }
  &__table-title {
    font-size: 18px;
    line-height: 30px;
    font-family: 'Panton_SemiBold';
    @include md {
      font-size: 14px;
      line-height: 30px;
    }
    &--xct {
      padding-bottom: 7px;
      @include md {
        padding-bottom: 10px;
      }
    }
    &--other {
      padding-top: 9px;
      @include md {
        padding-top: 10px;
      }
    }
  }
  &__table-cell-total-staked-currency,
  &__table-cell-citadel-staked-currency,
  &__table-cell-total-rewards-currency {
    font-size: 16px;
    line-height: 19px;
    color: $mid-blue;
    @include md {
      font-size: 14px;
      line-height: 17px;
    }
  }
  &__table-cell-total-staked-amount,
  &__table-cell-citadel-staked-amount,
  &__table-cell-total-rewards-amount {
    color: $too-dark-blue;
    font-size: 20px;
    line-height: 24px;
    font-family: 'Panton_Bold' !important;
    @include md {
      font-size: 16px;
      line-height: 20px;
    }
  }
  &__table-cell-citadel-staked-amount {
    color: $dark-blue;
  }
  &__rewards-list {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 31px 0 45px;
    margin-right: 10px;
    @include lg {
      padding: 0 26px 0 40px;
    }
    @include md {
      padding: 0 10px 0 24px;
    }
  }
}
</style>
