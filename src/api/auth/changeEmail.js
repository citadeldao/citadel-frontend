export const changeEmail = ({ newEmail }) => ({
  url: `/profile/change-email`,
  method: 'post',
  data: {
    newEmail,
  },
});

export const getChangeEmailInfo = () => ({
  url: `/profile/change-email/getInfo`,
  method: 'get',
});
