import './Signin.scss';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAxiosInterceptors from '../../service/axiosInterceptor';

function Signin() {
  useAxiosInterceptors();
  const navigate = useNavigate();

  // État initial du formulaire
  const [formDataSignin, setFormDataSignin] = useState({
    email: '',
    password: '',
    service: '',
    facturation: [{ facturation_code: '' }], // Tableau des codes de facturation
    role: '',
  });

  // Gère les changements dans les inputs
  const handleChangeSigninin = (
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (name === 'facturation_code' && typeof index === 'number') {
      // Mise à jour d'un code de facturation spécifique
      const updatedFacturation = [...formDataSignin.facturation];
      updatedFacturation[index].facturation_code = value;
      setFormDataSignin({ ...formDataSignin, facturation: updatedFacturation });
    } else {
      // Mise à jour des autres champs du formulaire
      setFormDataSignin({ ...formDataSignin, [name]: value });
    }
  };

  // Fonction pour ajouter un nouveau champ de facturation
  const addNewFacturationCodeInput = () => {
    setFormDataSignin((prevState) => ({
      ...prevState,
      facturation: [...prevState.facturation, { facturation_code: '' }],
    }));
  };

  // Envoi du formulaire
  const handleSubmitSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('formDataSignin', formDataSignin);

    try {
      // Envoi des données avec axios
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
        id="service"
        name="service"
        value={formDataSignin.service}
        onChange={handleChangeSigninin}
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
          onChange={(e) => handleChangeSigninin(e, index)}
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
        onChange={handleChangeSigninin}
        required
        placeholder="role"
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default Signin;
