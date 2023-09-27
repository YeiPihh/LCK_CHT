import React from "react";
import Header from '../Header/HeaderComponent.jsx'
import { useNavigate, Link } from 'react-router-dom';
import './Index.css'

const Index = () => {
    return(
        <>
            <Header />
            <main className="mainContent">
            <section className="introductionContainer">
                <h2 className="introductionTittle">Bienvenido al chat de texto con mas privacidad y funcionalidades</h2>
                <p className="introductionText">Únete y chatea con plena seguridad y privacidad.</p>
                <div className="introductionButtons">
                    <Link to="/login" className="cta-button login-button">Iniciar Sesión</Link>
                    <Link to="/register" className="cta-button register-button">Registrarse</Link>
                </div>
            </section>
            </main>  
        </>
        
    )
};

export default Index;





/*     
            
                      <div id="form-ui" className="register-container">
            <form onSubmit={handleSubmit} id="register-form">
              <div id="form-body">
                <div id="welcome-lines">
                  <div id="welcome-line-1" onClick={() => navigate('/')} >LCK CHT</div>
                  <div id="welcome-line-2">Welcome to Lock Chat</div>
                </div>
                <div id="input-area">
                  <div className={`form-inp ${isFocused ? "focused" : ""}`}>
                  <input placeholder="Username" type="text" id="username" name="username" value={username} onChange={handleChange} required onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                  <div className={`form-inp ${isFocused ? "focused" : ""}`}>
                    <input placeholder="Password" type="password" id="password" name="password" value={password} onChange={handleChange} required className={passwordMatch ? '' : 'error'} onFocus={handleFocus} onBlur={handleBlur} />

                  </div>
                  <div className={`form-inp ${isFocused ? "focused" : ""}`}>
                    <input placeholder="Confirm Password" type="password" id="confirm-password" name="confirmPassword" value={confirmPassword} onChange={handleChange} required className={passwordMatch ? '' : 'error'} onFocus={handleFocus} onBlur={handleBlur}  />
                    {!passwordMatch && <small className="errorText">Passwords don't match</small>}
                  </div>
                </div>
                <div id="submit-button-cvr">
                  <button id="submit-button" type="submit">Register</button>
                </div>
                <div id="forgot-pass" className="login-link">
                Already have an account?<br /> <a onClick={() => navigate('/login')}>Log in here</a>
                </div>
              </div>
            </form>
            </div>*/
