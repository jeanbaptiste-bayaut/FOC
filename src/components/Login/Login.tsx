import './Login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:3000/api/login',
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      setFormData({ email: '', password: '' });

      navigate('/coupons');
    } catch (error) {
      console.log(error);
      alert('Invalid credentials');
    }
  };

  return (
    <>
      <h2>Enter your credentials</h2>
      <form className="login" onSubmit={handleSubmit}>
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
