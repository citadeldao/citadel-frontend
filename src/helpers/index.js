import BigNumber from 'bignumber.js';

export const shuffleArray = (array) => {
  const words = [...array];
  const shuffled = [];

  let n = words.length;

  while (n) {
    n -= 1;
    const i = Math.floor(Math.random() * n);
    const [word] = words.splice(i, 1);

    shuffled.push(word);
  }

  return shuffled;
};

export const shareInValue = (value, itemValue) => {
  return BigNumber(itemValue).dividedBy(value).times(100).toNumber();
};
export const findWalletInArray = (arr = [], { address, net } = {}) => {
  return arr.find((w) => {
    const isAddress = w.address?.toLowerCase() === address?.toLowerCase();
    const isNet = w.net?.toLowerCase() === net?.toLowerCase();

    return net ? isAddress && isNet : isAddress;
  });
};

export const sortByAlphabet = (arr, key) => {
  const sortedList = [].concat(arr);

  sortedList.sort((a, b) => {
    if (a[key]?.toLowerCase() > b[key]?.toLowerCase()) {
      return 1;
    }

    if (a[key]?.toLowerCase() < b[key]?.toLowerCase()) {
      return -1;
    }

    return 0;
  });

  return sortedList;
};

export const addressTextWidth = (text, fontFamily, fontSize) => {
  const span = document.createElement('span');
  document.body.appendChild(span);
  span.style.font = fontFamily;
  span.style.fontSize = `${fontSize + 1}px`; // + 1 = Shit
  span.style.height = 'auto';
  span.style.width = 'auto';
  span.style.position = 'absolute';
  span.style.whiteSpace = 'no-wrap';
  span.innerHTML = text;
  const width = Math.ceil(span.clientWidth);
  document.body.removeChild(span);

  return width;
};

export const formattedWalletAddress = (
  address,
  wrapperWidth,
  fontFamily,
  fontSize
) => {
  if (addressTextWidth(address, fontFamily, fontSize) > +wrapperWidth) {
    const addressEnd = `...${address.substr(address.length - 5)}`;
    let addressStart = address.substring(0, address.length - 5);

    while (
      addressTextWidth(`${addressStart}${addressEnd}`, fontFamily, fontSize) >
      +wrapperWidth
    ) {
      addressStart = addressStart.substring(0, addressStart.length - 1);
    }

    return `${addressStart}${addressEnd}`;
  }

  return address;
};

export const parseHash = (hash) => {
  const hashArray = hash.slice(1).split('-');

  return {
    action: hashArray[0],
    net: hashArray[1],
    address: hashArray[2],
  };
};
export const findAddressWithNet = (list, { address, net }) =>
  list.find(
    (item) =>
      item.address?.toLowerCase() === address?.toLowerCase() && item.net === net
  );

export const getTokenIcon = (code) => {
  return `//${process.env.VUE_APP_HOST}/cryptofont/SVG/${code}.svg`;
};

export const tokenIconPlaceholder = (tokenName) => {
  const name = tokenName.trim().split(' ');
  const nameAbbr = [];

  if (name.length > 1) {
    nameAbbr[0] = name[0][0].toUpperCase();
    nameAbbr[1] = name[1][0].toUpperCase();
  } else if (name[0].length === 1) {
    nameAbbr[0] = name[0][0].toUpperCase();
    nameAbbr[1] = name[0][0].toUpperCase();
  } else {
    nameAbbr[0] = name[0][0].toUpperCase();
    nameAbbr[1] = name[0][1].toUpperCase();
  }

  return nameAbbr;
};

export const shortNameCrypto = (name) => {
  if (name.toLowerCase() === 'binance smart chain') {
    return 'BNB';
  }

  return name;
};

export const parseSnip20Txs = (txs, decimals = 6) => {
  const newTxs = txs.map((c) => ({
    to: c.receiver,
    from: c.sender,
    value: BigNumber(c.coins?.amount)
      .div(BigNumber(10).pow(decimals))
      .toNumber(),
  }));

  return newTxs;
};

export const getDecimalCount = (num) => {
  // Convert to String
  const numStr = String(num);
  // String Contains Decimal
  if (numStr.includes('.')) {
    return numStr.split('.')[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
};
export const isNullDerivationPath = (wallet) => {
  return wallet?.derivationPath?.slice(-2).replace(/\D/g, '') === '0';
};

export const getMiddleCutText = (text, maxLength = 50) => {
  const tailsLength = Math.floor((maxLength - 3) / 2);

  return text.length > maxLength
    ? `${text.slice(0, tailsLength)}...${text.slice(-tailsLength)}`
    : text;
};
