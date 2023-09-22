import React from "react";
import './Index.css'

const Index = () => {
    return(
        <main className="mainContent">
            <section className="introductionContainer">
                <h2 className="introductionTittle">Bienvenido al chat de texto con mas privacidad y funcionalidades</h2>
                <p className="introductionText">Únete y chatea con plena seguridad y privacidad.</p>
                <div className="introductionButtons">
                    <a href="/login" className="cta-button login-button">Iniciar Sesión</a>
                    <a href="/register" className="cta-button register-button">Registrarse</a>
                </div>
            </section>
        </main>
    )
};

export default Index;