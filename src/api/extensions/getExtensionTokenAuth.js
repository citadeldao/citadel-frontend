export const getExtensionTokenAuth = ({ extensionId, wallets }) => {
  const url = `/profile/extension/${extensionId}`;

  return {
    url,
    method: 'post',
    data: {
      wallets,
    },
  };
};
