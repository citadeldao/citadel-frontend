const CUSTOM_PERIOD = 'selectPeriod';
const LOADING = 'loading';
const NO_REWARDS = 'noRewards';
const NO_BALANCE = 'noBalance';
const NO_PRICE = 'noPrice';

export const getPlaceholderStatus = (chart = '', loading, period, data) => {
  const NO_DATA = chart.startsWith('rewards')
    ? NO_REWARDS
    : chart.startsWith('balance')
    ? NO_BALANCE
    : NO_PRICE;

  const isCustom = period === 'custom';

  if (loading) {
    return {
      show: true,
      text: LOADING,
    };
  } else if (isCustom && !data) {
    return {
      show: true,
      text: CUSTOM_PERIOD,
    };
  } else if (data && data.list) {
    const dataKeysLen = Object.keys(data.list).length;
    let notExist = dataKeysLen < 1;

    if (chart.startsWith('balance')) {
      notExist = dataKeysLen <= 1;
    }

    return {
      show: notExist,
      text: NO_DATA,
    };
  }

  return {
    show: false,
    text: NO_DATA,
  };
};
