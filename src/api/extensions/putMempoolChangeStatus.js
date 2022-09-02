export const putMempoolChangeStatus = ({ mempool_id, hash }) => {
  const url = `/transactions/mempool/change-status/?mempool_id=${mempool_id}&hash=${hash}`;

  return {
    url,
    method: 'put',
    data: {},
  };
};
