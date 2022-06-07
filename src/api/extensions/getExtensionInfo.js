export const getExtensionsInfo = ({ appId }) => {
  let url = `/profile/extension`;

  if (appId) {
    url = `${url}/${appId}`;
  }

  return {
    url,
    method: 'get',
  };
};
