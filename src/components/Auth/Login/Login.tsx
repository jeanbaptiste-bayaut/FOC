import './Login.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/AuthContext';

console.log(import.meta.env.VITE_API_URL);

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useAuth();

  // Function to handle the changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call to the login endpoint
      const user = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      // If the user exists, save it in the context and redirect to the coupons page
      if (user.data) {
        login({
          userId: user.data.userId,
          role: user.data.role,
          email: user.data.email,
        });
      } else {
        alert('Invalid credentials');
      }

      // Reset the form
      setFormData({ email: '', password: '' });

      // Save the facturation code in the local storage
      localStorage.setItem('factuCode', user.data.facturationCodeList);

      navigate('/coupons');
    } catch (error) {
      console.log(error);
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <form className="login" onSubmit={handleSubmit}>
        <h2>Enter your credentials</h2>
        <input
          type="email"
          id="login-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="email"
        />
        <input
          type="password"
          id="login-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="password"
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Login;
