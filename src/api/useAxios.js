import axios from 'axios';

export default function useAxios() {
  const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_URL,
    withCredentials: true,
  });
  const responseHandler = (response) => response.data;

  const errorHandler = (error) => {
    console.error(error);
    if (error?.response?.status === 403) {
      window.location.href = '/login';
    }
    return error.response.data;
  };

  axiosInstance.interceptors.response.use(responseHandler, errorHandler);

  return axiosInstance;
}
