export const getNetworkDataByKey = ({
  config = {},
  network = 'Others',
  key = {},
}) => {
  if (!config) return null;

  const [net, token] = network.split('_');

  const isNetExist = config[net];

  if (token && isNetExist) {
    return config[net].tokens[`${net}_${token}`][key];
  } else if (config[net]) {
    return config[net][key];
  }

  if (net === 'Others') return null;

  return null;
};
