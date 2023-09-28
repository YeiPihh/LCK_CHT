import React from "react";
import { Link } from 'react-router-dom';
import './Index.css'

const Index = () => {
    return(
        <>              
            <div id="form-ui" className="index-container">
              <div id="form-body">
                <div id="welcome-lines">
                  <div id="welcome-line-1"><img src='https://i.postimg.cc/BZwgYL7c/LCKCHT.png' width={'200px'} border='0' alt='LCKCHT'></img>    </div>
                  <div id="welcome-line-2">Welcome to Lock Chat, enjoy the privacy and security</div>
                </div>
            
                <div id="submit-button-cvr">
                  <button id="submit-button" className="indexRegister" type="submit"><Link to="/register" />Register</button>
                  <button id="submit-button" className="indexLogin" type="submit">Log in</button>
                </div>
          
              </div>
            </div>
        </>
        
    )
};

export default Index;





/*                 <Header />
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
            
            
            */
          
