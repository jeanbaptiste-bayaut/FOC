import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxiosInterceptors = () => {
  const navigate = useNavigate();

  // Intercept the responses
  axios.interceptors.response.use(
    (response) => {
      return response; // If the response is successful, return it
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        if (error.response.data.message === 'Token expired') {
          // If the token is expired, redirect to login
          navigate('/login');
        }
      }
      return Promise.reject(error); // For any other errors, reject the promise
    }
  );
};

export default useAxiosInterceptors;
