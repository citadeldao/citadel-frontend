export const sendSignedTransaction = (data) => ({
  url: `/transactions/${data.network}/${data.from}/send?version=1.1.0`,
  method: 'post',
  data: {
    signedTransaction: data.hash,
    type: data.deviceType,
    mem_tx_id: data.mem_tx_id ? data.mem_tx_id : null,
    proxy: data.proxy ? data.proxy : false,
  },
});
