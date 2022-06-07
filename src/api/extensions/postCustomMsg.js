export const postCustomMsg = ({ token, message }) => {
  let url = `/customMsg`;

  if (token) {
    url = `${url}?token=${token}`;
  }

  return {
    url,
    method: 'post',
    data: {
      to: 'app',
      from: 'main-front',
      type: 'message',
      toDeviceId: token,
      message,
    },
  };
};
