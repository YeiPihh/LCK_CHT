import React, { useState } from 'react';
import Button from '../Button/ButtonComponent.jsx';
import Header from '../Header/HeaderComponent.jsx'
import './Login.css';
import { useNavigate, Link  } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setFocus] = useState(false);
  const [isFocused1, setFocus1] = useState(false);
  const navigate = useNavigate();


  const handleFocus = () => {
    setFocus(true);
  };

  const handleBlur = () => {
    setFocus(false);
  };

  const handleFocus1 = () => {
    setFocus1(true);
  };

  const handleBlur1 = () => {
    setFocus1(false);
  };

  const handleLogin = (event) => {
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
        navigate('/chat');
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
    <div id="form-ui" className="login-container">
    <form onSubmit={handleLogin} id="login-form">
      <div id="form-body">
        <div id="welcome-lines">
          <div id="welcome-line-1"><Link to ="/">LCK CHT</Link></div>
          <div id="welcome-line-2">Welcome to Lock Chat</div>
        </div>
        <div id="input-area">
          <div className={`form-inp ${isFocused ? "focused" : ""}`}>
            <input placeholder="Username" type="text" id="username" required value={username} onChange={e => setUsername(e.target.value)} onFocus={handleFocus} onBlur={handleBlur} />
          </div>
          <div className={`form-inp ${isFocused1 ? "focused" : ""}`}>
            <input placeholder="Password" type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} onFocus={handleFocus1} onBlur={handleBlur1}  />
          </div>
        </div>
        <div id="submit-button-cvr">
          <button id="submit-button" type="submit">Login</button>
        </div>
        <div id="forgot-pass" className="login-link">
        ¿No tienes una cuenta? <br /> <Link to="/register">Regístrate aquí</Link>
        </div>
        <div id="forgot-pass" className="login-link">
        ¿Has olvidado tu contraseña? <Link to="/">Recuperala aquí</Link>
        </div>
      </div>
    </form>
    </div>
  
  );
};

export default Login;