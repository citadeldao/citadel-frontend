import { apies } from './apies';
import useAxios from './useAxios';
let axiosInstance = useAxios();

export default function useApi(type = 'general', separate = false) {
  const api = {};
  const patterns = apies[type];

  if (separate) {
    axiosInstance = useAxios();
  }

  Object.keys(patterns).map((patternName) => {
    const request = (data) => {
      const pattern = patterns[patternName](data);

      return axiosInstance[pattern.method](pattern.url, pattern.data);
    };
    api[patternName] = request;
  });

  return api;
}
