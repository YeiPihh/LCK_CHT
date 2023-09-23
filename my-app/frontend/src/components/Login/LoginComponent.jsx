import React, { useState } from 'react';
import Button from '../Button/ButtonComponent.jsx';
import Header from '../Header/HeaderComponent.jsx'
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:4567/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(data => {
      if (data && data.message === 'Logged in successfully') {
        window.location.href = '/chat';
      }
    })
    .catch(err => {
      if (err.status === 401) {
        err.json().then(errorData => {
          if (errorData.error === 'Usuario o contraseña incorrecta') {
            alert(errorData.error);
            // Aquí puedes actualizar el estilo de los inputs si es necesario
          } else {
            console.error(errorData);
          }
        });
      } else {
        console.error('Unhandled error:', err);
      }
    });
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} id="login-form">
          <label htmlFor="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            required 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <Button text="Iniciar Sesion" />
        </form>
        <p className="login-link">
          ¿No tienes una cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </>
  );
};

export default Login;