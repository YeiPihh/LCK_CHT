import React from 'react';
import Button from './Button/ButtonComponent'

const Register = () => {
  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form action="/register" method="post" id="register-form">
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" required />
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" required />
        <label htmlFor="confirm-password">Confirmar contraseña:</label>
        <input type="password" id="confirm-password" required />
        <Button text="Registrarse" />
      </form>
      <p className="login-link">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión aquí</a>
      </p>
    </div>
  );
};

export default Register;