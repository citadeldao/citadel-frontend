export const getExtensionsList = () => {
  const url = `/extensions/search?query=&version=1.0.6`;

  return {
    url,
    method: 'get',
  };
};
