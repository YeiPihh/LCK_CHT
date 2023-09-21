import React from 'react';
import Button from '../Button/ButtonComponent.jsx';
import './Login.css';

const Login = () => {
  return (
    <>
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form action="/login" method="post" id="login-form">
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" required />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" required />
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