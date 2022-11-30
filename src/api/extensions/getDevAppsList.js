export const getDevAppsList = () => {
  const url = `/extensions/dev-apps`;

  return {
    url,
    method: 'get',
  };
};
