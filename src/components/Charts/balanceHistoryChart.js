import Chart from 'chart.js/auto';

import { balanceHistoryTooltipHandler } from './Custom/tooltips';

import {
  LINE_CHART_STYLE_CONFIG,
  CHART_TICKS_STYLE,
  MONTH_COLORS_LIST,
  DAY_COLORS_LIST,
  COLORS,
  xLineDates,
  formatYLineText,
  dateToRender,
} from './Custom/config';

const balanceHistoryChart = {};

export const renderBalanceHistoryChart = (
  balanceHistory,
  currentTab,
  elementId,
  _,
  currentFiat
) => {
  if (!balanceHistory || !balanceHistory.list) return;

  if (balanceHistoryChart[elementId]) balanceHistoryChart[elementId].destroy();

  const CHART_LABELS = Object.keys(balanceHistory.list);
  const visibleLabels = xLineDates(CHART_LABELS);
  const allDates = CHART_LABELS;

  /**
   *
   * @Configurations
   * Balance History Line Chart
   *
   */

  const data = [];

  for (const period in balanceHistory.list) {
    const record = currentTab
      ? balanceHistory.list[period][currentTab?.toLowerCase()]
      : balanceHistory.list[period];
    if (record) data.push(record);
  }

  const CHART_DATASET = [
    {
      label: '',
      data: data,
      fill: true,
      ...LINE_CHART_STYLE_CONFIG,
      ...(!currentTab && { pointRadius: 0 }),
    },
  ];

  const CHART_DATA = {
    labels: CHART_LABELS,
    datasets: CHART_DATASET,
  };

  const PLUGINS = {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
      external: (context) =>
        balanceHistoryTooltipHandler(
          context,
          elementId,
          balanceHistory.list,
          COLORS.ACTIVE_MONTH,
          currentFiat
        ),
    },
  };

  const SCALES = {
    xMonths: {
      grid: {
        color: 'transparent',
        tickLength: 21,
      },
      ticks: {
        callback: (_, index) =>
          dateToRender(visibleLabels, allDates[index], 'xMonths'),
        ...CHART_TICKS_STYLE,
        padding: 3,
        color: MONTH_COLORS_LIST,
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
      grid: {
        borderColor: 'transparent',
        color: COLORS.CURRENCY,
        borderDash: [3, 3],
        drawBorder: false,
        tickLength: 0,
      },
      ticks: {
        callback: (index) => formatYLineText(index, currentTab, currentFiat),
        ...CHART_TICKS_STYLE,
        color: COLORS.CURRENCY,
        labelOffset: -10,
        z: 1,
        mirror: true,
        crossAlign: 'near',
      },
    },
  };

  const OPTIONS = {
    maintainAspectRatio: false,
    scales: SCALES,
    plugins: PLUGINS,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  const config = {
    type: 'line',
    data: CHART_DATA,
    options: OPTIONS,
  };
  balanceHistoryChart[elementId] = new Chart(
    document.querySelector(`#${elementId}`),
    config
  );
};
