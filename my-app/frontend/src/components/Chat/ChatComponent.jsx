// ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import MessageComponent from './Message/MessageComponent';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import MenuButtonComponent from './MenuButton/MenuButtonComponent.jsx';
import './Chat.css'


const socket = io('http://localhost:4567');

const ChatComponent = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
  const [shouldShowParagraph, setShouldShowParagraph] = useState(false);
  const [username, setUsername ] = useState('');
  const formRef = useRef(null);
  const [newContactUsername, setNewContactUsername] = useState('')

  useEffect(() => {

    fetch('http://localhost:4567/chat', {
      credentials: 'include' // Esto asegura que las cookies se envían con la solicitud
    })
    .then(response => response.json())
    .then(data => {
      
      if (data.success) {
        setContacts(data.contacts);
        setUsername(data.user.username);
      }
    })
    .catch(error => console.error('Hubo un problema con la petición Fetch:', error));
  }, []);
  
  useEffect(() => {
    // Aquí se hara la petición al servidor para obtener los mensajes del contacto seleccionado
    // Por ejemplo: fetch(`/api/messages/${selectedContact}`).then(/* actualizar el estado con los nuevos mensajes */)
    // Por ahora solo se usanran datos de muestra:
    if (selectedContact) {
      setMessages([
        { content: 'Hola', isOwnMessage: true },
        { content: '¿Qué tal?', isOwnMessage: false }
      ]);
    }
  }, [selectedContact]);

  const handleContactClick = (contact) => {
    setSelectedContact(contact.contact_id);
    //
  };

  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setMenuVisibility(false);
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
    }
  };

  const handleMenuVisibility = (e) => {
    e.stopPropagation(); // Detiene la propagación del evento
    setMenuVisibility(!menuVisibility); // Cambia la visibilidad del menú
    if (menuVisibility === true) {
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
    }
  };

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
      //añadir alerta
    });
    
    // Escuchar el evento de error al enviar una solicitud de amistad
    socket.on('friendRequestError', (message) => {
      console.log("Error: ", message);
    //añadir alerta    
  });
    setAddFormVisibility(false);
  };

  useEffect(() => {
    const wrapper = document.getElementById('friendRequestsWrapper');
    setShouldShowParagraph(wrapper.childNodes.length <= 1 && friendRequestVisibility === true);
     // ¡¡¡¡¡¡¡¡¡¡ CUANDO SE HABILITEN LAS SOLICITUDES DE AMISTAD HAY QUE ALMACENAR LA CANTIDAD DE SOLICITUDES EN UNA VARIABLE Y MODIFICAR ESTE EFFECT PARA NO ACCEDER AL DOM DIRECTAMENTE DESDE REACT!!!!!!!!!
  }, [friendRequestVisibility]);

  return (
    <div className="chat-container" onClick={handleClickOutside}>
      <div className="chat-sidebar">
        <div className="nav-list-chat-heads">
        <div className="menuContainer">
          {//<button id="menuButton" className="material-symbols-outlined" onClick={handleMenuVisibility} ref={formRef}>menu</button>
          }
          <MenuButtonComponent id="menuButton" onClick={handleMenuVisibility} ref={formRef}/>
                <div id="menuChat" className={menuVisibility ? 'visible' : 'hidden'} ref={formRef}>
                    <div id="homeButton">
                        <button className="material-symbols-outlined">home</button>
                        <span className="text">Volver al incio</span>
                    </div>
                    <div className="contact-icon">
                        <form id="addContactForm" className={addFormVisibility ? 'visible' : 'hidden'} onSubmit={handleAddContact}>
                            <input type="text" id="newContactUsername" placeholder="Usuario del contacto" autoComplete="off" name="nombre_usuario_añadir" value={newContactUsername} onChange={(e) => setNewContactUsername(e.target.value)} />
                            <button type="submit">Añadir</button>
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
          <ProfilePictureComponent imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png' username={username} />
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