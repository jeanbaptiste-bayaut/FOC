import './Signin.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const navigate = useNavigate();

  const [formDataSignin, setFormDataSignin] = useState({
    email: '',
    password: '',
    brand: '',
    facturation: '',
    role: '',
  });

  const handleChangeSigninin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataSignin({
      ...formDataSignin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:3000/api/signin',
        {
          email: formDataSignin.email,
          password: formDataSignin.password,
          brand: formDataSignin.brand,
          facturation_code: formDataSignin.facturation,
          role: formDataSignin.role,
        },
        {
          withCredentials: true,
        }
      );
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form className="signin" onSubmit={handleSubmitSignin}>
        <h2>Enter your informations to signin</h2>
        <small>All fields are mandatory*</small>
        <input
          type="email"
          id="signin-email"
          name="email"
          value={formDataSignin.email}
          onChange={handleChangeSigninin}
          required
          placeholder="email"
        />
        <input
          type="password"
          id="signin-password"
          name="password"
          value={formDataSignin.password}
          onChange={handleChangeSigninin}
          required
          placeholder="password"
        />
        <select
          id="signin-brand"
          name="signin-brand"
          value={formDataSignin.brand}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFormDataSignin({
              ...formDataSignin,
              brand: e.target.value,
            });
          }}
        >
          <option default-value="">Choose your brand</option>
          <option value="quiksilver">Quiksilver</option>
          <option value="roxy">Roxy</option>
          <option value="dcshoes">DCSHOES</option>
          <option value="billabong">BILLABONG</option>
          <option value="element">ELEMENT</option>
          <option value="rvca">RVCA</option>
        </select>
        <input
          type="text"
          id="facturation"
          name="facturation"
          value={formDataSignin.facturation}
          onChange={handleChangeSigninin}
          required
          placeholder="facturation"
        />
        <input
          type="text"
          id="role"
          name="role"
          value={formDataSignin.role}
          onChange={handleChangeSigninin}
          required
          placeholder="role"
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Signin;
