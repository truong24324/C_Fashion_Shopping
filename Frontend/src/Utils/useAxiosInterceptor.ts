import { useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Setup axios interceptors once
export const useAxiosInterceptor = () => {
  useMemo(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = 'Bearer ' + token;
                return axios(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          isRefreshing = true;

          try {
            const res = await axios.post('/api/refresh-token', null, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
              },
            });

            const newToken = res.data.token;
            localStorage.setItem('jwt_token', newToken);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
            processQueue(null, newToken);
            return axios(originalRequest);
          } catch (err) {
            processQueue(err, null);
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('refresh_token');
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            window.location.href = '/auth';
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
};
