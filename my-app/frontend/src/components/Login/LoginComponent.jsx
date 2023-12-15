import React, { useState } from 'react';
import './Login.css';
import { useNavigate, Link  } from 'react-router-dom';
import Swal from 'sweetalert2';

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setFocus] = useState(false);
  const navigate = useNavigate();

  const handleFocus = (id) => {
    setFocus(id);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  const handleLogin = (event) => {
    event.preventDefault();

    fetch(`${REACT_APP_SERVER_URL}/logout`, {
        credentials: 'include',
        method: 'GET',
      })
      .then(response => response.json())
      .then(data =>{
        if (data.status === 'success') {
          fetch(`${REACT_APP_SERVER_URL}/login`, {
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
                  Swal.fire({
                    title: 'Error ',
                    text: errorData.error,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
                } else {
                  console.error(errorData);
                  Swal.fire({
                    title: 'Error ',
                    text: 'Unexpected error, please try again later',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                  })
                }
              });
            } else {
              Swal.fire({
                title: 'Error ',
                text: 'Unexpected error, please try again later',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              })
              console.error('Unhandled error:', err);
            }
          });
        } else {
          console.error('Logout before to login failed');
        }
      })
      .catch(error => {
        console.error('An error occurred, while logged out before to login :', error);
      });
    };

  return (
    <div className='containerAll'>
      <div id="form-ui" className="login-container">
      <form onSubmit={handleLogin} id="login-form">
        <div id="formBodyLogin">
          <div id="welcome-lines">
            <div id="welcome-line-1"><Link to ="/">LCK CHT</Link></div>
            <div id="welcome-line-2">Welcome to Lock Chat</div>
          </div>
          <div id="input-area">
            <div className={`form-inp ${isFocused==='input1' ? "focused" : ""}`}>
              <input placeholder="Username" type="text" id="username" required value={username} onChange={e => setUsername(e.target.value)} onFocus={() => handleFocus('input1')} onBlur={handleBlur} />
            </div>
            <div className={`form-inp ${isFocused ==='input2' ? "focused" : ""}`}>
              <input placeholder="Password" type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} onFocus={() => handleFocus('input2')} onBlur={handleBlur}  />
            </div>
          </div>
          <div id="submitButtonLogin">
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
    </div>
  
  );
};

export default Login;