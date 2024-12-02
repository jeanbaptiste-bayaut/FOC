import './Signin.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAxiosInterceptors from '../../service/axiosInterceptor';

function Signin() {
  useAxiosInterceptors();
  const navigate = useNavigate();

  const [emailExists, setEmailExists] = useState(false);

  const [formDataSignin, setFormDataSignin] = useState({
    email: '',
    password: '',
    service: '',
    facturation: [{ facturation_code: '' }],
    role: '',
  });

  // Handles changes in the inputs
  const handleChangeSignin = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === 'facturation_code' && typeof index === 'number') {
      // Update a specific facturation code as it can be one ore more
      const updatedFacturation = [...formDataSignin.facturation];
      updatedFacturation[index].facturation_code = value;
      setFormDataSignin({ ...formDataSignin, facturation: updatedFacturation });
    } else {
      // Update the other fields
      setFormDataSignin({ ...formDataSignin, [name]: value });
    }
  };

  // Function to add a new facturation code input
  const addNewFacturationCodeInput = () => {
    setFormDataSignin((prevState) => ({
      ...prevState,
      facturation: [...prevState.facturation, { facturation_code: '' }],
    }));
  };

  // Submition of the form
  const handleSubmitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const checkIfEmailExists = await axios.post(
        'http://localhost:3000/api/users/email',
        {
          email: formDataSignin.email,
        },
        { withCredentials: true }
      );

      if (checkIfEmailExists.data) {
        setEmailExists(true);
        return;
      }
      // Call signin endpoint
      await axios.post(
        'http://localhost:3000/api/signin',
        {
          email: formDataSignin.email,
          password: formDataSignin.password,
          service: formDataSignin.service,
          facturationCodeList: formDataSignin.facturation,
          role: formDataSignin.role,
        },
        { withCredentials: true }
      );

      // redirect to login
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="signin" onSubmit={handleSubmitSignin}>
      <h2>Enter your informations to signin</h2>
      <small>All fields are mandatory*</small>

      <input
        type="email"
        id="signin-email"
        name="email"
        value={formDataSignin.email}
        onChange={handleChangeSignin}
        required
        placeholder="email"
      />
      {emailExists && <p>Email already exists</p>}
      <input
        type="password"
        id="signin-password"
        name="password"
        value={formDataSignin.password}
        onChange={handleChangeSignin}
        required
        placeholder="password"
      />
      <input
        type="text"
        id="service"
        name="service"
        value={formDataSignin.service}
        onChange={handleChangeSignin}
        required
        placeholder="service"
      />

      {/* Génération dynamique des inputs de facturation */}
      {formDataSignin.facturation.map((fact, index) => (
        <input
          key={index}
          type="text"
          name="facturation_code"
          value={fact.facturation_code}
          onChange={(e) => handleChangeSignin(e, index)}
          required
          placeholder="facturation"
        />
      ))}

      <p className="addFacturation" onClick={addNewFacturationCodeInput}>
        Add facturation code
      </p>

      <input
        type="text"
        id="role"
        name="role"
        value={formDataSignin.role}
        onChange={handleChangeSignin}
        required
        placeholder="role"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default Signin;
