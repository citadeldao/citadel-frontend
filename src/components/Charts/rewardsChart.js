import BigNumber from 'bignumber.js';
import Chart from 'chart.js/auto';

import { chartColors, OTHERS_COLOR } from './config';
import { coinColors, ethCoinColors } from './coinColors';

import { convertToLocalDate } from '@/helpers/date';
import { getNetworkDataByKey } from '@/helpers/networkConfig';

import { rewardsTooltipHandler } from './Custom/tooltips';

import {
  BAR_CHART_STYLE_CONFIG,
  CHART_TICKS_STYLE,
  MONTH_COLORS_LIST,
  DAY_COLORS_LIST,
  COLORS,
  xLineDates,
  formatYLineText,
  dateToRender,
} from './Custom/config';

const getValueForData = (list, date, net, tab) => {
  const currentTab = tab.toLowerCase() === 'usd' ? 2 : 1;
  for (const key in list[date]) {
    if (key === net) return list[date][key][currentTab];
  }
  return 0;
};

const rewardsChartElement = {};

export const renderRewardsChart = (
  rewardsChart,
  currentTab,
  elementId,
  { showCount = undefined, currency }
) => {
  if (!rewardsChart || !rewardsChart.list) {
    return [];
  }

  const datasets = {};
  const netSet = new Set();

  for (const key in rewardsChart.list) {
    for (const net in rewardsChart.list[key]) {
      netSet.add(net);
    }
  }

  const netArray = Array.from(netSet);

  for (const key in rewardsChart.list) {
    for (const index in netArray) {
      const net = netArray[index];

      if (!datasets[net]) {
        const code = getNetworkDataByKey({
          config: currency,
          network: net,
          key: 'code',
        });

        let backgroundColor = chartColors[index];

        if (ethCoinColors[net]) {
          backgroundColor = ethCoinColors[net];
        } else if (coinColors[code]) {
          backgroundColor = coinColors[code];
        }

        datasets[net] = {
          label: getNetworkDataByKey({
            config: currency,
            network: net,
            key: 'name',
          }),
          net,
          data: [],
          backgroundColor,
          tooltip: { net },
          ...BAR_CHART_STYLE_CONFIG,
        };
      }

      const response = getValueForData(rewardsChart.list, key, net, currentTab);
      datasets[net].data.push(response);
    }
  }

  const nets = Object.values(datasets).sort((a, b) => {
    return (
      b.data.reduce((acc, curr) => BigNumber(acc).plus(curr).toString(), 0) -
      a.data.reduce((acc, curr) => BigNumber(acc).plus(curr).toString(), 0)
    );
  });

  const visible = nets.slice(0, showCount);

  if (nets.length > showCount) {
    const others = nets.slice(showCount);
    let othersData = [];

    for (let i = 0; i < others.length; i++) {
      if (!othersData.length) {
        othersData = others[i].data;
      } else {
        others[i].data.forEach((dataItem, index) => {
          othersData[index] = BigNumber(othersData[index])
            .plus(dataItem)
            .toNumber();
        });
      }
    }

    const other = {
      label: 'Others',
      net: 'Others',
      data: othersData,
      backgroundColor: OTHERS_COLOR,
      tooltip: { net: 'Others' },
      nets: others.map((n) => n.net),
      ...BAR_CHART_STYLE_CONFIG,
    };

    visible.push(other);
  }

  if (rewardsChartElement[elementId]) {
    rewardsChartElement[elementId].destroy();
  }

  const labels = Object.keys(rewardsChart.list);
  const visibleLabels = xLineDates(labels);
  const allDates = labels.map(convertToLocalDate);

  /**
   *
   * @Configurations
   * Rewards Bar Chart
   *
   */

  const PLUGINS = {
    legend: {
      position: 'left',
      align: 'start',
      labels: {
        usePointStyle: true,
      },
    },
    title: {
      display: false,
    },

    tooltip: {
      enabled: false,
      external: (context) =>
        rewardsTooltipHandler(context, rewardsChart.list, visible, currency),
      position: 'nearest',
      yAlign: 'center',
      usePointStyle: true,
      intersect: false,
    },
  };

  const SCALES = {
    x: {
      display: false,
      stacked: true,
      grid: {
        display: false,
      },
    },
    xMonths: {
      grid: {
        color: 'transparent',
        tickLength: 21,
      },
      ticks: {
        callback: (_, index) =>
          dateToRender(visibleLabels, allDates[index], 'xMonths'),
        color: MONTH_COLORS_LIST,
        ...CHART_TICKS_STYLE,
      },
    },
    xDays: {
      grid: {
        color: 'transparent',
        drawBorder: false,
      },
      ticks: {
        callback: (_, index) =>
          dateToRender(visibleLabels, allDates[index], 'xDays'),
        color: DAY_COLORS_LIST,
        ...CHART_TICKS_STYLE,
      },
    },
    y: {
      stacked: true,
      grid: {
        borderColor: 'transparent',
        color: COLORS.CURRENCY,
        borderDash: [3, 3],
      },
      ticks: {
        color: COLORS.CURRENCY,
        ...CHART_TICKS_STYLE,
        labelOffset: -10,
        z: 0,
        mirror: true,
        crossAlign: 'near',
        callback: (index) => formatYLineText(index, currentTab),
      },
      suggestedMin: 0,
      min: 0,
      beginAtZero: true,
    },
  };

  const OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'point',
    },
    plugins: PLUGINS,
    scales: SCALES,
    indexAxis: 'x',
  };

  const CHART_DATA = {
    labels,
    datasets: visible,
  };

  const REWARDS_CHART_CONFIG = {
    type: 'bar',
    data: CHART_DATA,
    options: OPTIONS,
  };

  rewardsChartElement[elementId] = new Chart(
    document.querySelector(`#${elementId}`),
    REWARDS_CHART_CONFIG
  );
};
