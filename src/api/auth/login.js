export const login = (username) => ({
  url: `/profile/signin3`,
  method: 'post',
  data: { username },
});
