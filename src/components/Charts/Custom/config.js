import { convertToLocalDate } from '@/helpers/date';
import BigNumber from 'bignumber.js';
import { prettyNumber } from '@/helpers/prettyNumber';

export const MAX_TICKS_LIMIT = 12;

export const COLORS = {
  CURRENCY: '#BCC2D8',
  MONTH: '#AFBCCB',
  ACTIVE_MONTH: '#B7A8FF',
  DAY: '#000000',
  CHART_POINT: '#FFFFFF',
  LINE_BG: 'rgba(255, 87, 34, 0.2)',
  LINE_BORDER: '#FF5722',
};

export const BAR_CHART_STYLE_CONFIG = {
  pointRadius: 0,
  hoverRadius: 9,
  barThickness: 10,
  borderRadius: 1,
  pointBackgroundColor: COLORS.CHART_POINT,
  pointHoverBackgroundColor: COLORS.CHART_POINT,
  pointHoverBorderWidth: 3,
};

export const LINE_CHART_STYLE_CONFIG = {
  tension: 0.4,
  cubicInterpolationMode: 'monotone',
  lineTension: 0.2,
  borderWidth: 3,
  borderColor: COLORS.LINE_BORDER,
  backgroundColor: COLORS.LINE_BG,
  hoverRadius: 9,
  pointRadius: 4.5,
  pointBackgroundColor: COLORS.CHART_POINT,
  pointHoverBackgroundColor: COLORS.CHART_POINT,
  pointHoverBorderWidth: 3,
};

export const CHART_TICKS_STYLE = {
  autoSkip: false,
  maxRotation: 0,
  padding: 0,
  font: {
    lineHeight: 0.7,
    size: 14,
    family: 'Panton_Regular',
  },
};

export const DAY_COLORS_LIST = Array(MAX_TICKS_LIMIT).fill(COLORS.DAY);
export const MONTH_COLORS_LIST = Array(MAX_TICKS_LIMIT).fill(COLORS.MONTH);

export const formatYLineText = (data, tab) => {
  const currentTab = tab.toLowerCase();
  let formattedValue = prettyNumber(data);

  if (currentTab === 'btc') formattedValue = BigNumber(data).toFixed();

  return `${formattedValue} ${tab}`;
};

export const xLineDates = (dates) => {
  const tickGap = Math.round(dates.length / MAX_TICKS_LIMIT) || 1;
  const visibleLabels = [];

  for (let i = dates.length - 1; i >= 0; i = i - tickGap) {
    visibleLabels.push(convertToLocalDate(dates[i]));
  }

  return visibleLabels;
};

export const dateToRender = (visibleLabels, date, type) => {
  const index = type === 'xMonths' ? 1 : 0;
  const value = date?.split(' ')[index];
  return visibleLabels.includes(date) ? value : '';
};
