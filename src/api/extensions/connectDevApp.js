export const connectDevApp = ({ token }) => {
  const url = `/extensions/dev-center/connect/app`;

  return {
    url,
    method: 'put',
    data: {
      token,
    },
  };
};
