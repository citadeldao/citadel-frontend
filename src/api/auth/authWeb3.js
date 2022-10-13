export const authWeb3 = ({ address, net }) => ({
  url: `/profile/auth/web3/get-message?address=${address}&net=${net}`,
  method: 'get',
  data: {
    address,
    net,
  },
});
