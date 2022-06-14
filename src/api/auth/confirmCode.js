export const confirmCode = ({ code, username }) => ({
  url: `/profile/signin3/confirm`,
  method: 'post',
  data: {
    code,
    username,
  },
});
