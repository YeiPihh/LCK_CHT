import React, { useState, useEffect, forwardRef } from "react";
import { useNavigate, Link  } from "react-router-dom";
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import '../Chat.css';
import './MenuChat.css';

const socket = io('http://localhost:4567');

const MenuChat = forwardRef(( props, ref) => {
    const [addFormVisibility, setAddFormVisibility] = useState(false);
    const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
    const [shouldShowParagraph, setShouldShowParagraph] = useState(false);
    const [newContactUsername, setNewContactUsername] = useState('')

    const handleAddFormVisibility = () => {
        setAddFormVisibility(!addFormVisibility);
      };
    
      const handleFriendRequestVisibility = () => {
        setFriendRequestVisibility(!friendRequestVisibility);
      };
    
      const handleAddContact = async(e) => {
        e.preventDefault();
        socket.emit('sendFriendRequest', newContactUsername)
        // Escuchar el evento de éxito al enviar una solicitud de amistad
        socket.on('friendRequestSuccess', (message) => {
          console.log("Éxito: ", message);
          Swal.fire({
            title: 'Success',
            text: message,
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
        });
        
        // Escuchar el evento de error al enviar una solicitud de amistad
        socket.on('friendRequestError', (message) => {
          console.log("Error: ", message);
          Swal.fire({
            title: 'Error ',
            text: message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
      });
        setAddFormVisibility(false);
      };
    
      useEffect(() => {
        const wrapper = document.getElementById('friendRequestsWrapper');
        setShouldShowParagraph(wrapper.childNodes.length <= 1 && friendRequestVisibility === true);
         // ¡intentar no acceder al react almacenando la cantidad de solicitudes en una variable!
      }, [friendRequestVisibility]);

    return (
        <div id="menuChat" className={props.className} ref={ref}>
            <div id="homeButton">
                <button className="material-symbols-outlined">home</button>
                <span className="text">Volver al incio</span>
            </div>
            <div className="contact-icon">
                <form id="addContactForm" className={addFormVisibility ? 'visible' : 'hidden'} onSubmit={handleAddContact}>
                    <input type="text" id="newContactUsername" placeholder="Usuario del contacto" autoComplete="off" name="nombre_usuario_añadir" value={newContactUsername} onChange={(e) => setNewContactUsername(e.target.value)} />
                    <button className="button" type="submit">Añadir</button>
                </form>
                <button id="contactButton" className="material-symbols-outlined" onClick={handleAddFormVisibility}>add_circle</button>
                <span className="text">Añadir contacto</span>
            </div>
            <div className="solicitud">
                <div id="friendRequestsWrapper" className={friendRequestVisibility ? 'visible' : 'hidden'}>
                    <p className={shouldShowParagraph ? 'visible' : 'hidden'}>No tienes ninguna solicitud pendiente</p>
                </div>
                <button id="friendRequestButton" className="material-symbols-outlined" onClick={handleFriendRequestVisibility}>mail</button>
                <span className="text">Solicitudes entrantes</span>
            </div>
            <div className="nav-list-logout">
                <button id="logoutButton" className="material-symbols-outlined">logout</button>
                <span className="text">Cerrar Sesion</span>
            </div>
        </div>
    )
});

export default MenuChat;