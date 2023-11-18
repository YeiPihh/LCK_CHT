// ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import MessageComponent from './Message/MessageComponent';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import MenuButtonComponent from './MenuButton/MenuButtonComponent.jsx';
import FriendRequest from './FriendRequests/FriendRequests.jsx';

import './Chat.css';
import './MenuButton/MenuButton.css';


const socket = io('http://localhost:4567');

const ChatComponent = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [shouldShowParagraph, setShouldShowParagraph] = useState(false);
  const [username, setUsername ] = useState('');
  const [userId, setUserId ] = useState('');
  const formRef = useRef(null);
  const [newContactUsername, setNewContactUsername] = useState('');

  // autenticacion para entrar a la pagina /chat
  useEffect(() => {
    fetch('http://localhost:4567/check-authentication',{
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      })
      .then(response=> {
        if(response.ok){
            return response.json();
        } else {
          throw new Error('Failed to authenticate')
        }
      })
      .then(data=>{
        
        if (data.isAuthenticated === false){
          navigate('/Login')
          console.log(data.isAuthenticated)
          Swal.fire({
            title: 'Error ',
            text: 'Authenticator error! You need to log in first',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        } else {
          console.log('Autenticacion exitosa')
        }
      })
      .catch(error=>{
        console.error('Error during authentication:', error);
      });
  }, []); 

  // hook para extraer informacion de la base de datos
  useEffect(() => {

    fetch('http://localhost:4567/chat', {
      credentials: 'include' // Esto asegura que las cookies se envían con la solicitud
    })
    .then(response => response.json())
    .then(data => {
      
      if (data.success) {
        setContacts(data.contacts);
        setUsername(data.user.username.toUpperCase());
        setUserId(data.user.id);
        socket.emit('informationUser', { username: username, userId: userId })
        
      }
    })
    .catch(error => console.error('Hubo un problema con la petición Fetch:', error));
  }, [username, userId]);
  
  // visibilidad del menu

  // oculta el menu si se pulsa fuera de este
  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setMenuVisibility(false);
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
      setMenuClicked(false);
    }
  };
  //muestra/oculta el menu si se pulsa el menuButton
  const handleMenuVisibility = (e) => {
    e.stopPropagation(); // Detiene la propagación del evento
    setMenuVisibility(!menuVisibility); // Cambia la visibilidad del menú
    setMenuClicked(!menuClicked);
    if (menuVisibility === true) {
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
    }
  };

  const handleFriendRequestVisibility = () => {
    setFriendRequestVisibility(!friendRequestVisibility);
    setAddFormVisibility(false);

    fetch ('http://localhost:4567/friend-requests', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setFriendRequests(data.friendRequests);
        console.log(friendRequests)
      }
    })
  };

  const handleAcceptRequest = (senderId) => {
    socket.emit('acceptFriendRequest', senderId)
    console.log(senderId)
    socket.on('friendRequestSuccess', (message) => {
      Swal.fire({
          title: 'Perfecto',
          text: message,
          icon: 'success',
          confirmButtonText: 'Aceptar'
      });
      console.log(message);
      
    });
  
    // creamos un alert si no se ha podido agregar al contacto, el mensaje de error es controlado por el servidor
    socket.on('friendRequestError', (message) => {
        console.log(message);
        Swal.fire({
            title: 'Oops...',
            text: message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
  }

  const handleIgnoreRequest = (requestId) => {
    console.log('pendiente por hacer en socket.js. con el request id eliminamos la peticion de la base de datos y hay que hacer algo para que se elimine de la interfaz del usuario')
  }

  //Logout handler
  const handleLogout = () => {
    fetch('http://localhost:4567/logout', {
      credentials: 'include',
      method: 'GET',
    })
    .then(response => response.json())
    .then(data =>{
      if (data.status === 'success') {
        navigate('/Login');
        
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('An error occurred:', error);
    });
  };

  //Addcontact handlers
  const handleAddFormVisibility = () => {
    setAddFormVisibility(!addFormVisibility);
    setFriendRequestVisibility(false);    
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

  //buttonHome
  const handleRedirectHome = () => {
    navigate('/');
  }


  // no usados
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
  };

  return (
    <div className="chat-container" onClick={handleClickOutside}>
      <div className="chat-sidebar">
        <div className="nav-list-chat-heads">
        <div className="menuContainer">
          {//<button id="menuButton" className="material-symbols-outlined" onClick={handleMenuVisibility} ref={formRef}>menu</button>
          }
          <MenuButtonComponent  id="menuButton" onClick={handleMenuVisibility} ref={formRef} iconClass={menuClicked ? "clicked" : ""} textClass={menuClicked ? "clicked" : ""}/>
                <div id="menuChat" className={`no-select ${menuVisibility ? 'visible' : ''}`} ref={formRef}>
                    <div id="homeButton">
                        <button className="material-symbols-outlined" onClick={handleRedirectHome}>home</button>
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
                          {
                            friendRequests.length === 0 ? (
                              <p>No hay solicitudes pendientes</p>
                            ) : (
                              friendRequests.map(request => (
                                <FriendRequest 
                                          acceptRequest={() => handleAcceptRequest(request.sender_id)}  
                                          ignoreRequest= {() => handleIgnoreRequest(request.id)} 
                                          key={request.id} 
                                          request={request} 
                                        />
                              ))
                            )
                          }
                             
                        </div>
                        <button id="friendRequestButton" className="material-symbols-outlined" onClick={handleFriendRequestVisibility}>mail</button>
                        <span className="text">Solicitudes entrantes</span>
                    </div>
                    <div className="nav-list-logout">
                        <button id="logoutButton" className="material-symbols-outlined" onClick={handleLogout}>logout</button>
                        <span className="text">Cerrar Sesion</span>
                    </div>
                </div>
          <ProfilePictureComponent imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png' username={username} />
        </div>
        
      </div>
      
        <ChatListComponent contacts={contacts} onContactClick={handleContactClick} />
      
      </div>
      
      <div className="chat-main containerAll">
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