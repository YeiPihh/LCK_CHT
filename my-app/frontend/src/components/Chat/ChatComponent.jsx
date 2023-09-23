// ChatComponent.jsx
import React, { useState, useEffect } from 'react';
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import MessageComponent from './Message/MessageComponent';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import './Chat.css'

const ChatComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);

  useEffect(() => {
    // Suponiendo que tienes alguna forma de autenticación como un token
    fetch('http://localhost:4567/chat', {
      credentials: 'include' // Esto asegura que las cookies se envían con la solicitud
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setContacts(data.contacts);
      }
    })
    .catch(error => console.error('Hubo un problema con la petición Fetch:', error));
  }, []);
  
  useEffect(() => {
    // Aquí harías la petición al servidor para obtener los mensajes del contacto seleccionado
    // Por ejemplo: fetch(`/api/messages/${selectedContact}`).then(/* actualizar el estado con los nuevos mensajes */)
    // Para este ejemplo, utilizaremos datos de muestra:
    if (selectedContact) {
      setMessages([
        { content: 'Hola', isOwnMessage: true },
        { content: '¿Qué tal?', isOwnMessage: false }
      ]);
    }
  }, [selectedContact]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact.contact_id);
    // Aquí podrías hacer más cosas, como mostrar/ocultar diferentes partes de la UI
  };

  const handleMeuVisibility = (click) => {
    setMenuVisibility(!menuVisibility)
  };

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="nav-list-chat-heads">
        <div className="menuContainer">
          <span id="menuButton" className="material-symbols-outlined" onClick={handleMeuVisibility}>menu</span>
                <div id="menuChat" className={menuVisibility ? 'visible' : 'hidden'}>
                    <div id="homeButton">
                        <button className="material-symbols-outlined">home</button>
                        <span className="text">Volver al incio</span>
                    </div>
                    <div className="contact-icon">
                        <form id="addContactForm">
                            <input type="text" id="newContactUsername" placeholder="Usuario del contacto" autoComplete="off" name="nombre_usuario_añadir" />
                            <button type="submit">Añadir</button>
                        </form>
                        <button id="contactButton" className="material-symbols-outlined">add_circle</button>
                        <span className="text">Añadir contacto</span>
                    </div>
                    <div className="solicitud">
                        <div id="friendRequestsWrapper" className="hidden">
                            Aquí se mostrarán las solicitudes de amistad
                        </div>
                        <button id="friendRequestButton" className="material-symbols-outlined">mail</button>
                        <span className="text">Solicitudes entrantes</span>
                    </div>
                    <div className="nav-list-logout">
                        <button id="logoutButton" className="material-symbols-outlined">logout</button>
                        <span className="text">Cerrar Sesion</span>
                    </div>
                </div>
          <ProfilePictureComponent imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png' username="USERNAME" />
        </div>
        
      </div>
      <div className="nav-list-chat no-select">
        <ChatListComponent contacts={contacts} onContactClick={handleContactClick} />
      </div>
      </div>
      
      <div className="chat-main">
        {selectedContact && (
          <div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <MessageComponent key={index} content={message.content} isOwnMessage={message.isOwnMessage} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;