const CUSTOM_PERIOD = 'selectPeriod';
const LOADING = 'loading';
const NO_REWARDS = 'noRewards';
const NO_BALANCE = 'noBalance';

export const getPlaceholderStatus = (chart = '', loading, period, data) => {
  const NO_DATA = chart.startsWith('rewards') ? NO_REWARDS : NO_BALANCE;
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
    let notExist = true;

    if (chart.startsWith('balance')) {
      notExist = Object.keys(data.list).length <= 1;
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
