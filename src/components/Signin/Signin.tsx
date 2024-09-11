import React, { useState } from 'react';
import axios from 'axios';

function Signin() {
  const [formDataSignin, setFormDataSignin] = useState({
    email: '',
    password: '',
    brand: '',
    facturation: '',
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
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form className="signin" onSubmit={handleSubmitSignin}>
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
        <input
          type="text"
          id="sigin-brand"
          name="brand"
          value={formDataSignin.brand}
          onChange={handleChangeSigninin}
          required
          placeholder="brand"
        />
        <input
          type="text"
          id="facturation"
          name="facturation"
          value={formDataSignin.facturation}
          onChange={handleChangeSigninin}
          required
          placeholder="facturation"
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default Signin;
