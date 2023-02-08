import Chart from 'chart.js/auto';

import BigNumber from 'bignumber.js';

import { balanceHistoryTooltipHandler } from './Custom/tooltips';
import { convertToLocalDate } from '@/helpers/date';

const MAX_TICKS_LIMIT = 12;
const CURRENCY_COLOR = '#BCC2D8';
const DAY_COLOR = '#000000';
const MONTH_COLOR = '#AFBCCB';
const ACTIVE_MONTH_COLOR = '#B7A8FF';
const CHART_BG_COLOR = 'rgba(255, 87, 34, 0.2)';
const CHART_BORDER_COLOR = '#FF5722';
const CHART_POINT_COLOR = '#FFFFFF';

const CHART_STYLE_CONFIG = {
  tension: 0.4,
  cubicInterpolationMode: 'monotone',
  lineTension: 0.2,
  borderWidth: 3,
  borderColor: CHART_BORDER_COLOR,
  backgroundColor: CHART_BG_COLOR,
  hoverRadius: 9,
  pointRadius: 4.5,
  pointBackgroundColor: CHART_POINT_COLOR,
  pointHoverBackgroundColor: CHART_POINT_COLOR,
  pointHoverBorderWidth: 3,
};

const CHART_TICKS_STYLE = {
  autoSkip: false,
  maxRotation: 0,
  padding: 0,
  font: {
    lineHeight: 0.7,
    size: 14,
    family: 'Panton_Regular',
  },
};

const DAY_COLORS_LIST = Array(MAX_TICKS_LIMIT).fill(DAY_COLOR);
const MONTH_COLORS_LIST = Array(MAX_TICKS_LIMIT).fill(MONTH_COLOR);

const balanceHistoryChart = {};

const createVisibleLabels = (dates) => {
  const tickGap = Math.round(dates.length / MAX_TICKS_LIMIT) || 1;
  const visibleLabels = [];

  for (let i = dates.length - 1; i >= 0; i = i - tickGap) {
    visibleLabels.push(convertToLocalDate(dates[i]));
  }

  return visibleLabels;
};

export const renderBalanceHistoryChart = (
  balanceHistory,
  currentTab,
  elementId
) => {
  if (!balanceHistory || !balanceHistory.list) return;

  if (balanceHistoryChart[elementId]) balanceHistoryChart[elementId].destroy();

  const CHART_LABELS = Object.keys(balanceHistory.list);
  const allDates = CHART_LABELS.map(convertToLocalDate);
  const visibleLabels = createVisibleLabels(CHART_LABELS);

  /**
   *
   * @Configurations
   * Balance History Line Chart
   *
   */

  const dateToRender = (date, type) => {
    const index = type === 'xMonths' ? 1 : 0;
    const value = date?.split(' ')[index];
    return visibleLabels.includes(date) ? value : '';
  };

  const data = [];

  for (const period in balanceHistory.list) {
    const record = balanceHistory.list[period][currentTab?.toLowerCase()];
    if (record) data.push(record);
  }

  const CHART_DATASET = [
    {
      label: '',
      data: data,
      fill: true,
      ...CHART_STYLE_CONFIG,
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
          ACTIVE_MONTH_COLOR
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
        callback: (_, index) => dateToRender(allDates[index], 'xMonths'),
        ...CHART_TICKS_STYLE,
        color: MONTH_COLORS_LIST,
      },
    },
    xDays: {
      grid: {
        color: 'transparent',
        drawBorder: false,
      },
      ticks: {
        callback: (_, index) => dateToRender(allDates[index], 'xDays'),
        color: DAY_COLORS_LIST,
        ...CHART_TICKS_STYLE,
      },
    },
    y: {
      grid: {
        borderColor: 'transparent',
        color: CURRENCY_COLOR,
        borderDash: [3, 3],
        drawBorder: false,
        tickLength: 0,
      },
      ticks: {
        callback: (index) => BigNumber(index).toNumber(),
        ...CHART_TICKS_STYLE,
        color: MONTH_COLOR,
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
