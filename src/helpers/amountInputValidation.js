import { i18n } from '@/plugins/i18n';
// import { getDecimalCount } from '@/helpers';
const { t } = i18n.global;

export default ({ amount, wallet, maxAmount, type }) => {
  if (+amount) {
    if (
      (type === 'send' &&
        wallet.minSendAmount &&
        wallet.minSendAmount > +amount) ||
      (type === 'stake' &&
        wallet.minStakingAmount &&
        wallet.minStakingAmount > +amount)
    ) {
      return t('minAmountError', {
        code: wallet.code,
        minAmount:
          type === 'send' ? wallet.minSendAmount : wallet.minStakingAmount,
      });
    }
    // if (getDecimalCount(amount) > +wallet.config.decimals) {
    //   if (+amount < 1) {
    //     return t('minAmountError', {
    //       code: wallet.code,
    //       minAmount: wallet.minAmount,
    //     });
    //   } else {
    //     return t('maxFloatDigits', {
    //       amount: wallet.config.decimals,
    //     });
    //   }
    // }

    if (+amount > +maxAmount) {
      return t('insufficientFunds');
    }
  }

  if (+maxAmount === 0) {
    return t('dontHaveEnoughFounds');
  }

  return false;
};
