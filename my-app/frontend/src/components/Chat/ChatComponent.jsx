// ChatComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import MenuButtonComponent from './MenuButton/MenuButtonComponent.jsx';
import MenuChat from './MenuChat/MenuChatComponent.jsx';
// import MessageComponent from './Message/MessageComponent';
// import FriendRequest from './FriendRequests/FriendRequests.jsx';

import './Chat.css';
import './MenuButton/MenuButton.css';


const socket = io('http://localhost:4567');

const ChatComponent = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [username, setUsername ] = useState('');
  const [userId, setUserId ] = useState('');
  const formRef = useRef(null);
  const [newContactUsername, setNewContactUsername] = useState('');
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
   // const [messages, setMessages] = useState([]);

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
        socket.emit('informationUser', { username: data.user.username, userId: data.user.id })
      }
    })
    .catch(error => console.error('Hubo un problema con la petición Fetch:', error));
  }, []);
  
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
        
      }
    })
  };

  useEffect(()=>{
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
    return () => {
      socket.off('friendRequestSuccess');
      socket.off('friendRequestError');
    };
  }, [])

  const handleAcceptRequest = (senderId) => {
    setIsProcessingRequest(true);
    socket.emit('acceptFriendRequest', senderId);

    socket.on('acceptFriendRequestError', (message) => {
      console.log("Error: ", message);
      Swal.fire({
        title: 'Error ',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });

  };

  const handleIgnoreRequest = (requestId) => {
    setIsProcessingRequest(true);
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
    setAddFormVisibility(false);
  };



  //buttonHome
  const handleRedirectHome = () => {
    navigate('/');
  }

  // no usados
  // useEffect(() => {
  //   // Aquí se hara la petición al servidor para obtener los mensajes del contacto seleccionado
  //   // Por ejemplo: fetch(`/api/messages/${selectedContact}`).then(/* actualizar el estado con los nuevos mensajes */)
  //   // Por ahora solo se usanran datos de muestra:
  //   if (selectedContact) {
  //     setMessages([1
  //       { content: 'Hola', isOwnMessage: true },
  //       { content: '¿Qué tal?', isOwnMessage: false }
  //     ]);
  //   }
  // }, [selectedContact]);
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
          <MenuChat
            menuVisibility={menuVisibility}
            formRef={formRef}
            handleRedirectHome={handleRedirectHome}
            addFormVisibility={addFormVisibility}
            handleAddContact={handleAddContact}
            newContactUsername={newContactUsername}
            setNewContactUsername={setNewContactUsername}
            handleAddFormVisibility={handleAddFormVisibility}
            friendRequestVisibility={friendRequestVisibility}
            isProcessingRequest={isProcessingRequest}
            handleAcceptRequest={handleAcceptRequest}
            handleIgnoreRequest={handleIgnoreRequest}
            friendRequests={friendRequests}
            handleFriendRequestVisibility={handleFriendRequestVisibility}
            handleLogout={handleLogout}
          />
          <ProfilePictureComponent imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png' username={username} />
        </div>
        
      </div>
      
        <ChatListComponent contacts={contacts} onContactClick={handleContactClick} />
      
      </div>
      
      <div className="chat-main containerAll">
        {selectedContact && (
          <div>
            <div className="chat-messages">
             {/*  {messages.map((message, index) => (
                <MessageComponent key={index} content={message.content} isOwnMessage={message.isOwnMessage} />
              ))} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;