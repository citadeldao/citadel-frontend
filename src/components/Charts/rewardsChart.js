import BigNumber from 'bignumber.js';
import { prettyNumber } from '@/helpers/prettyNumber';
import { getNetworkDataByKey } from '@/helpers/networkConfig';
import { getMonthName } from '@/helpers/date';
import Chart from 'chart.js/auto';
import { chartColors } from './config';
import { rewardsTooltipHandler } from './Custom/tooltips';

const getValueForData = (list, date, net, tab) => {
  const currentTab = tab.toLowerCase() === 'usd' ? 2 : 1;
  for (const key in list[date]) {
    if (key === net) return list[date][key][currentTab];
  }
  return -1;
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

  const barStyle = {
    pointRadius: 0,
    hoverRadius: 9,
    barThickness: 10,
    borderRadius: 1,
    pointBackgroundColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderWidth: 3,
  };

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
        datasets[net] = {
          label: getNetworkDataByKey({
            config: currency,
            network: net,
            key: 'name',
          }),
          net,
          data: [],
          backgroundColor: chartColors[index],
          tooltip: { net },
          ...barStyle,
        };
      }

      const response = getValueForData(rewardsChart.list, key, net, currentTab);
      datasets[net].data.push(response);
    }
  }

  const nets = Object.values(datasets).sort((a, b) => {
    return (
      a.data.reduce((acc, i) => acc + i, 0) -
      b.data.reduce((acc, i) => acc + i, 0)
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
      backgroundColor: chartColors[11],
      tooltip: { net: 'Others' },
      nets: others.map((n) => n.net),
      ...barStyle,
    };

    visible.push(other);
  }

  if (rewardsChartElement[elementId]) {
    rewardsChartElement[elementId].destroy();
  }

  const labels = Object.keys(rewardsChart.list);

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
      stacked: true,
      grid: {
        display: false,
      },
      ticks: {
        color: '#AFBCCB',
        callback: (index) =>
          getMonthName(Object.keys(rewardsChart.list)[index]),
      },
    },
    y: {
      stacked: true,
      grid: {
        borderColor: 'transparent',
        color: '#BCC2D8',
        borderDash: [3, 3],
      },
      ticks: {
        color: '#AFBCCB',
        callback: (index) => prettyNumber(index),
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
