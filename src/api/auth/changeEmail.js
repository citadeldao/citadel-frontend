export const changeEmail = ({ newEmail }) => ({
  url: `/profile/change-email`,
  method: 'post',
  data: {
    newEmail,
  },
});
