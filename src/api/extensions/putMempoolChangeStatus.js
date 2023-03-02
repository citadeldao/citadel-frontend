export const putMempoolChangeStatus = ({ mempool_id, hash }) => {
  const url = `/transactions/mempool/change-status/?mempool_id=${mempool_id}&hash=${hash}&version=${process.env.VUE_APP_API_VERSION}`;

  return {
    url,
    method: 'put',
    data: {},
  };
};
