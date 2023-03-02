export const getMempool = () => ({
  url: '/transactions/mempool',
  method: 'get',
  data: {
    params: {
      version: process.env.VUE_APP_API_VERSION,
    },
  },
});
