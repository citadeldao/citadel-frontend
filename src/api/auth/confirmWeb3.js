export const confirmWeb3 = ({ address, sign, captchaResKey, pubKey, net }) => ({
  url: `/profile/auth/web3/confirm`,
  method: 'post',
  data: {
    address,
    sign,
    captchaResKey,
    pubKey,
    net,
  },
});
