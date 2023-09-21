import React from "react";
import './Index.css'

const Index = () => {
    return(
        <main className="main-content">
            <section className="hero">
                <h2 className="hero-title">Bienvenido al chat de texto con mas privacidad y funcionalidades</h2>
                <p className="hero-text">Únete y chatea con plena seguridad y privacidad.</p>
                <div className="cta-buttons">
                    <a href="/login" className="cta-button login-button">Iniciar Sesión</a>
                    <a href="/register" className="cta-button register-button">Registrarse</a>
                </div>
            </section>
        </main>
    )
};

export default Index;