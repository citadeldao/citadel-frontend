export const connectToDevCenter = ({ token }) => {
  const url = `/extensions/dev-center/connect/account`;

  return {
    url,
    method: 'put',
    data: {
      token,
    },
  };
};
