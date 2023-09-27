import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Header from '../Header/HeaderComponent.jsx'
import Button from '../Button/ButtonComponent.jsx'
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { username, password, confirmPassword } = formData;
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isFocused, setFocus] = useState(false);
  const navigate = useNavigate();


  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (confirmPassword.length >= password.length) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]); // Dependencias del efecto
  
  const handleRegister = async (e) => {
    e.preventDefault();
    

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Passwords must match',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:4567/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.msg === 'User registered successfully') {

        navigate('/login');

        Swal.fire({
          title: 'Success',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });

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
    <div id="form-ui" className="register-container">
    <form onSubmit={handleRegister} id="register-form">
      <div id="form-body">
        <div id="welcome-lines">
          <div id="welcome-line-1"><Link to="/">LCK CHT</Link></div>
          <div id="welcome-line-2">Welcome to Lock Chat</div>
        </div>
        <div id="input-area">
          <div className={`form-inp ${isFocused ? "focused" : ""}`}>
          <input placeholder="Username" type="text" id="username" name="username" value={username} onChange={handleChange} required onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div className={`form-inp ${isFocused ? "focused" : ""} ${passwordMatch ? '' : 'error'}`}>
            <input placeholder="Password" type="password" id="password" name="password" value={password} onChange={handleChange} required onFocus={handleFocus} onBlur={handleBlur} />
            
          </div>
          <div className={`form-inp ${isFocused ? "focused" : ""} ${passwordMatch ? '' : 'error'} `}>
            <input placeholder="Confirm Password" type="password" id="confirm-password" name="confirmPassword" value={confirmPassword} onChange={handleChange} required onFocus={handleFocus} onBlur={handleBlur}  />
          </div>
          {!passwordMatch && <small className="errorText">Passwords don't match</small>}
        </div>
        <div id="submit-button-cvr">
          <button id="submit-button" type="submit">Register</button>
        </div>
        <div id="forgot-pass" className="login-link">
        Already have an account?<br /> <Link to="/login">Log in here</Link>
        </div>
      </div>
    </form>
    </div>

  );
};

export default Register; 