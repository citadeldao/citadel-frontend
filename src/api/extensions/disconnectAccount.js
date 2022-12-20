export const disconnectAccount = ({ developer_id }) => {
  const url = `/extensions/dev-center/disconnect/account`;

  return {
    url,
    method: 'put',
    data: {
      developer_id,
    },
  };
};
