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
      console.log('1', error);
      if (error.response && error.response.status === 401) {
        console.log('2', error.response);
        if (error.response.data.message === 'Token expired') {
          console.log('3', error.response);
          // If the token is expired, redirect to login
          navigate('/login');
        }
      }
      return Promise.reject(error); // For any other errors, reject the promise
    }
  );
};

export default useAxiosInterceptors;
