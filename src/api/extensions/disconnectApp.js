export const disconnectApp = ({ project_id }) => {
  const url = `/extensions/dev-center/disconnect/app`;

  return {
    url,
    method: 'put',
    data: {
      project_id,
    },
  };
};
