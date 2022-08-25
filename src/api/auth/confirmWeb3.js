export const confirmWeb3 = ({ address, sign, pubKey, net }) => ({
  url: `/profile/auth/web3/confirm`,
  method: 'post',
  data: {
    address,
    sign,
    pubKey,
    net,
  },
});
