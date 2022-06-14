import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import { useWindowSize } from 'vue-window-size';
import { createDatasetForRewardsChart } from '@/components/Charts/rewardsChart';
import { screenWidths } from '@/config/sreenWidthThresholds';
import { tabsList2, tabsListmd2 } from '@/static/dateTabs';
import notify from '@/plugins/notify';

export default function useChart({
  canvasElement,
  storeAction,
  storeGetter,
  render,
  showCount,
}) {
  const store = useStore();

  const currentFilterTab = ref(1);
  const currentTab = ref('USD');
  const isExpanded = ref(false);
  const isToggleHovered = ref(false);

  const networksConfig = computed(() => store.getters['networks/config']);

  const { width } = useWindowSize();
  const tabs = computed(() =>
    width.value < screenWidths.lg ? tabsListmd2 : tabsList2
  );

  const customList = computed(() =>
    store.getters['wallets/activeList'] === 'all'
      ? 'all'
      : store.getters['wallets/customWalletsList'].find(
          (c) => c.name === store.getters['wallets/activeList']
        )?.id
  );

  const balanceHistory = computed(
    () => store.getters[storeGetter][customList.value]?.[currentFilterTab.value]
  );
  const rewardsChart = computed(
    () => store.getters[storeGetter][customList.value]?.[currentFilterTab.value]
  );
  const datasetsArray = computed(() =>
    createDatasetForRewardsChart(
      rewardsChart.value,
      currentTab.value,
      showCount
    )
  );

  const netsPercent = computed(() => {
    const hasOthers = !!datasetsArray.value.find((n) => n.net === 'Others');
    // sum of all rewards in all networks
    const maxValue = datasetsArray.value.reduce(
      (maxVal, c) =>
        BigNumber(maxVal)
          .plus(c.data.reduce((sum, i) => BigNumber(sum).plus(i).toNumber(), 0))
          .toNumber(),
      0
    );
    let netsPercents = datasetsArray.value
      .map((c) => {
        const sumOfData = c.data.reduce(
          (sum, i) => BigNumber(sum).plus(i).toNumber(),
          0
        );

        return {
          percent: BigNumber(sumOfData)
            .dividedBy(maxValue)
            .multipliedBy(100)
            .toNumber(),
          name:
            c.net === 'Others' ? 'Others' : networksConfig.value?.[c.net]?.name,
          color: c.backgroundColor,
        };
      })
      .sort((a, b) =>
        a.percent > b.percent ? -1 : a.percent < b.percent ? 1 : 0
      );

    const others = netsPercents.find((n) => n.name === 'Others');

    netsPercents = netsPercents.filter((n) => n.name !== 'Others');

    if (hasOthers && others.percent !== 0) {
      netsPercents.push(others);
    }

    return netsPercents;
  });

  const dateChangeHandler = async (val) => {
    const from = +moment(val[0]);
    const to = +moment(val[1]);
    const now = +moment();

    if (from || to) {
      if (to > now || from > now) {
        notify({
          type: 'warning',
          text: 'Incorrect Date',
        });
      } else {
        const dateFrom = +moment(from).startOf('day');
        const dateTo = +moment(to).endOf('day');
        await store.dispatch(storeAction, {
          list: customList.value,
          dateFrom,
          dateTo,
        });
      }
    }
  };

  const currentFilterTabChangeBalanceHistoryHandler = async () => {
    if (currentFilterTab.value === 'custom') {
      return;
    }

    if (!balanceHistory.value) {
      await store.dispatch(storeAction, {
        list: customList.value,
        months: currentFilterTab.value,
      });
    }

    render(balanceHistory.value, currentTab.value, canvasElement);
  };

  const currentFilterTabChangeRewardsChartHandler = async () => {
    if (currentFilterTab.value === 'custom') {
      return;
    }

    if (!rewardsChart.value) {
      await store.dispatch(storeAction, {
        list: customList.value,
        months: currentFilterTab.value,
      });
    }

    render(
      rewardsChart.value,
      datasetsArray.value,
      currentTab.value,
      canvasElement,
      networksConfig.value
    );
  };

  return {
    currentFilterTab,
    currentTab,
    info: networksConfig,
    rewardsChart,
    datasetsArray,
    netsPercent,
    tabs,
    dateChangeHandler,
    currentFilterTabChangeBalanceHistoryHandler,
    currentFilterTabChangeRewardsChartHandler,
    isExpanded,
    balanceHistory,
    customList,
    isToggleHovered,
  };
}
