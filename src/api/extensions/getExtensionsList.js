export const getExtensionsList = () => {
  const url = `/extensions/search?query=`;

  return {
    url,
    method: 'get',
  };
};
