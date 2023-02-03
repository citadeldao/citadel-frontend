import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;

export const ERRORS = {
  UNKNOWN_ERROR_CODE: 901,
};

export const keplrErrors = {
  'Signer mismatched': 'Please change account in Keplr to sign transaction',
};

export const getErrorText = (errorStr) => {
  if (!errorStr || typeof errorStr !== 'string') return '';
  if (errorStr.includes('unregistered interface')) {
    return 'Transaction failure. The network does not support Ledger Authz.';
  }
  return '';
};

export const getErrorTextByCode = (error) => {
  const message = error?.data?.currentApp
    ? t(`errors.${error.code}.variant1`, {
        rightApp: error.data.rightApp,
        currentApp: error.data.currentApp,
      })
    : error?.data?.rightApp
    ? t(`errors.${error.code}.variant2`, {
        rightApp: error.data.rightApp,
      })
    : t(`errors.${error.code}`);
  return message ? message : t(`errors.${ERRORS.UNKNOWN_ERROR_CODE}`);
};
