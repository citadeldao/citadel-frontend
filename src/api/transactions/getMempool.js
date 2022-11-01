export const getMempool = () => ({
  url: '/transactions/mempool',
  method: 'get',
  data: {
    params: {
      version: '1.1.0',
    },
  },
});
