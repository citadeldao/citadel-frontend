export const getNetworkDataByKey = ({
  config = {},
  network = 'Others',
  key = {},
}) => {
  if (!config) return null;

  const [net, token] = network.split('_');

  if (net === 'Others') return null;

  let result = null;

  if (config[net]) result = config[net];

  if (token && result) {
    result = config[net]?.tokens?.[`${net}_${token}`];
  }

  if (key === 'allKeys') return result || {};
  else return result[key] || {};
};
