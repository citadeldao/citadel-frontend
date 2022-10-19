const validateEth = (privateKey) => {
  if (!privateKey.startsWith('0x'))
    return (
      /^[0-9a-fA-F]+$/.test(privateKey) && [64].includes(privateKey.length)
    );
  return (
    /^0x[0-9a-fA-F]+$/.test(privateKey) && [66].includes(privateKey.length)
  );
};

const validateBtc = (privateKey) => {
  return (
    /^[0-9a-zA-Z]+$/.test(privateKey) && [51, 52].includes(privateKey.length)
  );
};

const validateHex = (privateKey) => {
  return /^[0-9a-fA-F]+$/.test(privateKey) && [64].includes(privateKey.length);
};

const validateIost = (privateKey) => {
  return /^[0-9a-zA-Z]+$/.test(privateKey) && [87].includes(privateKey.length);
};

const validateTezos = (privateKey) => {
  return (
    /^edsk[0-9a-zA-z]+$/.test(privateKey) && [98].includes(privateKey.length)
  );
};

export const validatePrivateKey = (net, privateKey) => {
  const coins = {
    eth: validateEth,
    bsc: validateEth,
    arbitrum: validateEth,
    optimism: validateEth,

    btc: validateBtc,
    icon: validateHex,
    iost: validateIost,
    tez: validateTezos,
  };

  return (coins[net] && coins[net](privateKey)) || validateHex(privateKey);
};
