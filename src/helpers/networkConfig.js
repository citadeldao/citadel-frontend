export const getNetworkDataByKey = ({
  config = {},
  network = 'Others',
  key = {},
}) => {
  console.log('LOG..', config, network, key);
  if (!config) return null;

  const [net, token] = network.split('_');
  console.log('LOG2..', net, token);

  if (net === 'Others') return null;

  let result = null;

  if (config[net]) result = config[net];

  if (token && result) {
    result = config[net].tokens[`${net}_${token}`];
  }

  if (key === 'allKeys') return result;
  else return result[key];
};
