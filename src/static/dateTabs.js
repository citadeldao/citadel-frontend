import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const tabsList = [
  {
    value: 1,
    label: `${t('month')}`,
  },
  {
    value: 3,
    label: `3 ${t('month')}`,
  },
  {
    value: 6,
    label: `6 ${t('month')}`,
  },
  {
    value: 12,
    label: `${t('oneYear')}`,
  },
  {
    value: 'all',
    label: `${t('all')}`,
  },
  {
    value: 'custom',
    label: `${t('custom')}`,
  },
];
// difference from tabsList is that in tabsList - "1 Month", here it is - "Month"
export const tabsList2 = [
  {
    value: 1,
    label: `${t('month')}`,
  },
  {
    value: 3,
    label: `3 ${t('month')}`,
  },
  {
    value: 6,
    label: `6 ${t('month')}`,
  },
  {
    value: 12,
    label: `${t('oneYear')}`,
  },
  {
    value: 'all',
    label: `${t('all')}`,
  },
  {
    value: 'custom',
    label: `${t('custom')}`,
  },
];
export const tabsListmd = [
  {
    value: 1,
    label: `1${t('monthAbbr')}`,
  },
  {
    value: 3,
    label: `3${t('monthAbbr')}`,
  },
  {
    value: 6,
    label: `6${t('monthAbbr')}`,
  },
  {
    value: 12,
    label: `1${t('yearAbbr')}`,
  },
  {
    value: 'all',
    label: `${t('all')}`,
  },
  {
    value: 'custom',
    label: `${t('custom')}`,
  },
];
// difference from tabsListmd is that in tabsListmd - "1 monthAbbr", here it is - "monthAbbr"
export const tabsListmd2 = [
  {
    value: 1,
    label: `${t('monthAbbr')}`,
  },
  {
    value: 3,
    label: `3${t('monthAbbr')}`,
  },
  {
    value: 6,
    label: `6${t('monthAbbr')}`,
  },
  {
    value: 12,
    label: `1${t('yearAbbr')}`,
  },
  {
    value: 'all',
    label: `${t('all')}`,
  },
  {
    value: 'custom',
    label: `${t('custom')}`,
  },
];

export const tabsListWithDays = [
  {
    value: 7,
    label: `${t('week')}`,
  },
  {
    value: 30,
    label: `${t('month')}`,
  },
  {
    value: 182,
    label: `6 ${t('month')}`,
  },
  {
    value: 365,
    label: `${t('oneYear')}`,
  },
];
export const tabsListWithDaysMd = [
  {
    value: 7,
    label: `${t('week')}`,
  },
  {
    value: 30,
    label: `${t('month')}`,
  },
  {
    value: 182,
    label: `6 ${t('monthAbbr')}`,
  },
  {
    value: 365,
    label: `1${t('yearAbbr')}`,
  },
];
