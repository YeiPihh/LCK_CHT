import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Button from '../Button/ButtonComponent.jsx'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { username, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas deben coincidir',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4567/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.msg === 'User registered successfully') {
        Swal.fire({
          title: 'Success',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

        window.location.href = '/login';
      } else if (data.msg === 'User already exists') {
        Swal.fire({
          title: 'Error ',
          text: data.msg,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} id="register-form">
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" name="username" value={username} onChange={handleChange} required />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" value={password} onChange={handleChange} required />
        <label htmlFor="confirm-password">Confirmar contraseña:</label>
        <input type="password" id="confirm-password" name="confirmPassword" value={confirmPassword} onChange={handleChange} required />
        <Button text="Registrarse" />
      </form>
      <p className="login-link">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default Register;