import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import moment from 'moment';
import { useWindowSize } from 'vue-window-size';

import { screenWidths } from '@/config/sreenWidthThresholds';

import { createDatasetForRewardsChart } from '@/components/Charts/rewardsChart';

// import { getNetworkDataByKey } from '@/helpers/networkConfig';

import { tabsList2, tabsListmd2 } from '@/static/dateTabs';

export default function useChart({
  canvasElement,
  storeAction,
  storeGetter,
  render,
  showCount,
  hasFiat,
}) {
  const store = useStore();
  const currentWallet = computed(() => store.getters['wallets/currentWallet']);
  const currentToken = computed(() => store.getters['subtokens/currentToken']);

  const currentFilterTab = ref(1);
  const currentTab = ref(hasFiat ? null : 'USD');
  const currentFiat = ref(hasFiat ? 'USD' : null);
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

  const chartData = computed(() =>
    store.getters[storeGetter](
      canvasElement,
      currentFiat.value ? 'all' : customList.value,
      currentFilterTab.value,
      currentFiat.value
    )
  );

  const datasetsArray = computed(() =>
    createDatasetForRewardsChart(chartData.value, currentTab.value, showCount)
  );

  // const netsPercent = computed(() => {
  //   const hasOthers = !!datasetsArray.value.find((n) => n.net === 'Others');
  //   // sum of all rewards in all networks
  //   const maxValue = datasetsArray.value.reduce(
  //     (maxVal, c) =>
  //       BigNumber(maxVal)
  //         .plus(c.data.reduce((sum, i) => BigNumber(sum).plus(i).toNumber(), 0))
  //         .toNumber(),
  //     0
  //   );
  //   let netsPercents = datasetsArray.value
  //     .map((c) => {
  //       const sumOfData = c.data.reduce(
  //         (sum, i) => BigNumber(sum).plus(i).toNumber(),
  //         0
  //       );

  //       return {
  //         percent: BigNumber(sumOfData)
  //           .dividedBy(maxValue)
  //           .multipliedBy(100)
  //           .toNumber(),
  //         color: c.backgroundColor,
  //         name: getNetworkDataByKey({
  //           config: networksConfig.value,
  //           network: c.net,
  //           key: 'name',
  //         }),
  //       };
  //     })
  //     .sort((a, b) =>
  //       a.percent > b.percent ? -1 : a.percent < b.percent ? 1 : 0
  //     );

  //   const others = netsPercents.find((n) => n.name === 'Others');

  //   netsPercents = netsPercents.filter((n) => n.name !== 'Others');

  //   if (hasOthers && others?.percent !== 0) {
  //     netsPercents.push(others);
  //   }

  //   return netsPercents;
  // });

  const dateChangeHandler = async (val) => {
    const from = moment(val[0]).valueOf();
    const to = moment(val[1]).valueOf();

    if (from || to) {
      const dateFrom = moment(from).startOf('day').valueOf();
      const dateTo = moment(to).endOf('day').valueOf();

      await store.dispatch(storeAction, {
        list: currentFiat.value ? 'all' : customList.value,
        dateFrom,
        dateTo,
        target: canvasElement,
        net: currentToken?.value?.net || currentWallet?.value?.net,
        fiat: currentFiat.value,
      });
      render(
        chartData.value,
        currentTab.value,
        canvasElement,
        {
          currency: networksConfig.value,
          showCount,
        },
        currentFiat.value
      );
    }
  };

  const filterTabChangeHandler = async () => {
    if (!chartData.value) {
      await store.dispatch(storeAction, {
        list: currentFiat.value ? 'all' : customList.value,
        months: currentFilterTab.value,
        target: canvasElement,
        net: currentToken?.value?.net || currentWallet?.value?.net,
        fiat: currentFiat.value,
      });
    }

    render(
      chartData.value,
      currentTab.value,
      canvasElement,
      {
        currency: networksConfig.value,
        showCount,
      },
      currentFiat.value
    );
  };

  return {
    chartData,
    datasetsArray,
    info: networksConfig,

    currentTab,
    currentFilterTab,

    currentFiat,

    tabs,
    customList,

    isExpanded,
    isToggleHovered,

    dateChangeHandler,
    filterTabChangeHandler,
  };
}
