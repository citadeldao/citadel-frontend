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
