export const getDecorateLabel = (net, label) => {
  const labels = {
    eth: {
      Secret: 'Secret (sETH)',
    },
  };

  return labels[net] && labels[net][label] || label;
};
