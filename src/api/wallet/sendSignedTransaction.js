export const sendSignedTransaction = (data) => ({
  url: `/transactions/${data.network}/${data.from}/send?version=${process.env.VUE_APP_API_VERSION}`,
  method: 'post',
  data: {
    signedTransaction: data.hash,
    type: data.deviceType,
    mem_tx_id: data.mem_tx_id ? data.mem_tx_id : null,
    proxy: data.proxy ? data.proxy : false,
  },
});
