// ChatComponent.jsx

//dependencias
import React, { useState, useEffect, useRef, useContext } from 'react';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';

//components
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import MenuButtonComponent from './MenuButton/MenuButtonComponent.jsx';
import MenuChat from './MenuChat/MenuChatComponent.jsx';
import ChatMain from './Chatmain/ChatMain.jsx';
import ContextMenu from './ContextMenu/ContextMenu.jsx';


//styles
import './Chat.css';
import './MenuButton/MenuButton.css';

const socket = io('http://192.168.1.54:4567');

// creacion de estilos dentro de js con JSS
const useStyles = createUseStyles({
    userProfileContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

// creacion de contexto para pasar informacion de los mensajes
export const MessagesContext = React.createContext({
  messages: [],
  setMessages: () => {},
  userId: '',
  setUserId: () => {},
  isWaitingClick: '', 
  setIsWaitingClick: () => {},
  selectedContact: '',
  setSelectedContact: () => {},
  selectedContactName: ''
})

const ChatComponent = () => {

  const classes = useStyles();
  
  const formRef = useRef(null);
  const contextMenuRef = useRef(null);

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactName, setSelectedContactName] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [username, setUsername ] = useState('');
  const [userId, setUserId ] = useState('');
  const [newContactUsername, setNewContactUsername] = useState('');
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [messages, setMessages] = useState({});
  const [isWaitingClick, setIsWaitingClick] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [coordenades, setCoordenades] = useState({ x:0, y:0 })

   // hook para extraer informacion de la base de datos
  useEffect(() => {

    fetch('http://192.168.1.54:4567/chat', {
      credentials: 'include' // Esto asegura que las cookies se envían con la solicitud
    })
    .then(response => response.json())
    .then(data => {

      if (data.success) {
        // seteamos todas las variables que nos ha proporcionado el servidor mediante la api /chat
        setContacts(data.contacts);
        setUsername(data.user.username.toUpperCase());
        setUserId(data.user.id);
        socket.emit('informationUser', { username: data.user.username, userId: data.user.id }) // mandamos al servidor la informacion del usuario mediante informationUser
      }
    })
    .catch(error => console.error('Hubo un problema con la petición Fetch:', error));
  }, []);

  // autenticacion para entrar a la pagina /chat
  useEffect(() => {
    fetch('http://192.168.1.54:4567/check-authentication',{
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
  
  // precargar el success y error de socketFriendRequest
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
  }, []);

  // recibir mensajes tiempo real
  useEffect(()=> {
    
    socket.on('receiveMessage', (message)=> {
      setMessages(prevMessages => [...prevMessages, message]);
      socket.emit('newContacts');
    });
    
    return () => {
      socket.off('receiveMessage')
    };
    
  }, []);

  useEffect(() => {
    const handleNewContacts = (newContacts) => {
      setContacts(newContacts);
      console.log(newContacts);
    };
  
    socket.on('newContactsSuccess', handleNewContacts);
  
    // La función de limpieza debe desactivar el mismo evento que se activó.
    return () => {
      socket.off('newContactsSuccess', handleNewContacts);
    };

  }, []);

  useEffect(() => {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 0);
  }, [messages]);

  // useEffect (()=> {
  //   socket.on('getNewContacts', (contact) => {
  //     debugger
  //     console.log(contacts)
  //     setContacts(prevContacts => [...prevContacts, contact[0]]);
  //   });

  //   return () => {
  //     socket.off('getNewContacts')
  //   }
  // }, []);

  const sendMessage = (messageData) => {
    socket.emit('sendMessage', messageData);
   
  };
  
  const handleContactClick = (e, contact) => {
    e.preventDefault();
    
    if (e.button === 0) {
      setSelectedContact(contact.contact_id);
      setSelectedContactName(contact.username);
      fetch(`http://192.168.1.54:4567/chat-history/${contact.contact_id}`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response=> response.json())
      .then(data => {
        
        if (data.success) {
          setMessages(data.messages);
          setIsWaitingClick(false);
          
        }
      })
      .catch(error => console.error('Hubo un problema con la peticion Fetch:', error));
    }
    else if (e.button === 2) {
      setSelectedContact(contact.contact_id);
      setShowContextMenu(!showContextMenu);
      setCoordenades({ x: e.pageX, y:e.pageY });
      setMenuVisibility(false);
    }
  };
  
  // visibilidad del menu
  const handleClickOutside = (e) => {
    if (formRef.current && !formRef.current.contains(e.target)) {
      setMenuVisibility(false);
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
      setMenuClicked(false);
    }
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false);
    }
  };
  const handleMenuVisibility = (e) => {
    e.stopPropagation(); // Detiene la propagación del evento
    setMenuVisibility(!menuVisibility);
    setShowContextMenu(false) // Cambia la visibilidad del menú
    setMenuClicked(!menuClicked);
    if (menuVisibility === true) {
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
    }
  };
  const handleFriendRequestVisibility = () => {
    setFriendRequestVisibility(!friendRequestVisibility);
    setAddFormVisibility(false);

    fetch ('http://192.168.1.54:4567/friend-requests', {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setFriendRequests(data.friendRequests);
        
      }
    })
  };
  const handleAcceptRequest = (senderId) => {
    
    setIsProcessingRequest(true);
    socket.emit('acceptFriendRequest', senderId);
    socket.on('getNewContacts', (contact) => {
      setContacts(prevContacts => [...prevContacts, contact[0]]);
    });

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
  const handleIgnoreRequest = (senderId) => {
    setIsProcessingRequest(true);
    socket.emit('ignoreFriendRequest', senderId);

    socket.on('ignoreFriendRequestError', (message) => {
      console.log("Error: ", message);
      Swal.fire({
        title: 'Error ',
        text: message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    });
  };
  const handleLogout = () => {
    fetch('http://192.168.1.54:4567/logout', {
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
  const handleRedirectHome = () => {
    navigate('/');
  };

      
  const handleClearChat = () => {
    socket.emit('clearChat', selectedContact);
    socket.on('clearChatSuccess', (message) => {
      setMessages([]);
      console.log(contacts)
      let newContactVisual = contacts.map((item) => ( item.contact_id === 6 ? {...item, lastMessage: null} : item ));
      setContacts(newContactVisual);
      console.log(message)
    })
    socket.on('clearChatError', (message) => {
      console.log(message)
    })
  };
  
  const handleDeleteContact = () => {
      socket.emit('deleteContact', selectedContact);
      socket.on('deleteContactSuccess', (message) => {
        
        console.log(message)
      })
      socket.on('deleteContactError', (message) => {
        console.log(message)
      })
  };





  return (
    <MessagesContext.Provider value={{ messages, setMessages, userId, setUserId, isWaitingClick, selectedContact, selectedContactName}}>

    <div className="chat-container" onClick={handleClickOutside}>
      
      <aside className={`chat-sidebar ${selectedContact ? '' : 'active'}`}>
        <div className="nav-list-chat-heads">
        <div className="menuContainer">
          <MenuButtonComponent  id="menuButton" onClick={handleMenuVisibility} ref={formRef} iconClass={menuClicked ? "clicked" : ""} textClass={menuClicked ? "clicked" : ""} btnClicked={menuClicked ? "clicked" : ""} />
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
          <div className={`${classes.userProfileContainer} no-select`}>
            <ProfilePictureComponent username={username} />
            {/* <div className='usernameSide'>{username}</div> */}
          </div>
        </div>
        
      </div>
        <ChatListComponent contacts={contacts} onContactClick={handleContactClick} />
        <ContextMenu x={coordenades.x} y={coordenades.y} showContextMenu={showContextMenu} contextMenuRef={contextMenuRef} handleClearChat={handleClearChat} handleDeleteContact={handleDeleteContact} />
      </aside>
      
      <div className={`chat-main ${selectedContact ? 'active' : ''}`}>
        <ChatMain sendMessage={sendMessage} />
      </div>
    </div>

    </MessagesContext.Provider>
  );
};

export default ChatComponent;