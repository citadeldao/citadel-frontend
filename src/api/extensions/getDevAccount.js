export const getDevAccount = () => {
  const url = `/extensions/dev-center/account`;

  return {
    url,
    method: 'get',
  };
};
