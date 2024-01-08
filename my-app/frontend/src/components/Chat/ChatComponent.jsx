// ChatComponent.jsx

//dependencias
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import { fetchData } from '../../fetch.js';
import { SVG_LOADING} from './svg.js';


//components
import ChatListComponent from './ChatList/ChatListComponent.jsx';
import ProfilePictureComponent from './ProfilePicture/ProfilePictureComponent';
import MenuButtonComponent from './MenuButton/MenuButtonComponent.jsx';
import MenuChat from './MenuChat/MenuChatComponent.jsx';
import ChatMain from './Chatmain/ChatMain.jsx';
import ContextMenu from './ContextMenu/ContextMenu.jsx';
import ContextMenuMessage from './ContextMenu/ContextMenuMessage.jsx';


//styles
import './Chat.css';
import './MenuButton/MenuButton.css';


const {REACT_APP_SERVER_URL} = process.env;



const socket = io(REACT_APP_SERVER_URL);

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
  selectedContactName: '',
  messageSelected:'',
  setMessageSelected:() => {},
  username: '',
  secondSelectedContactId: '',
})

const ChatComponent = () => {

  const  SECONDARY_CLICK = 2;
  const  PRINCIPAL_CLICK = 0;

  const classes = useStyles();

  const formRef = useRef(null);
  const contextMenuRef = useRef(null);
  const contextMenuMessageRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactName, setSelectedContactName] = useState(null);
  const [secondSelectedContactId, setSecondSelectedContactId] = useState(null);
  const [menuVisibility, setMenuVisibility] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);
  const [addFormVisibility, setAddFormVisibility] = useState(false);
  const [friendRequestVisibility, setFriendRequestVisibility] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [username, setUsername ] = useState('');
  const [userId, setUserId ] = useState('');
  const [newContactUsername, setNewContactUsername] = useState('');
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isWaitingClick, setIsWaitingClick] = useState(true);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [coordenades, setCoordenades] = useState({ x:0, y:0 });
  const [showContextMenuMessage, setShowContextMenuMessage] = useState(false);
  const [messageSelected, setMessageSelected] = useState('');
  const [temporizador, setTemporizador] = useState(null);

  const redirectLogin = useCallback((tittle, message, icon) => {
    navigate('/Login');
    Swal.fire({
      title: tittle,
      text: message,
      icon: icon,
      confirmButtonText: 'Aceptar'
    });
  }, [navigate]);

   // hook para extraer informacion de la base de datos
   useEffect(() => {

    Promise.all([
      fetchData(REACT_APP_SERVER_URL, 'chat', 'GET', '').then(response => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 401) {
        setIsAuthenticated(false);
      } else {
        redirectLogin('Error', 'Your request failed', 'error')
        throw new Error('Failed to get your chat');
      }
    }).then(data => {
      if (data && data.success) {
        setContacts(data.contacts);
        setUsername(data.user.username.toUpperCase());
        setUserId(data.user.id);
        socket.emit('informationUser', { username: data.user.username, userId: data.user.id });
      }
    }).catch(error => {
      console.error('Hubo un problema con la petición Fetch:', error);
      redirectLogin('Error', 'Your request failed', 'error')
    }),


      fetchData(REACT_APP_SERVER_URL, 'friend-requests', 'GET', '')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          setIsAuthenticated(false);
        } else {
          redirectLogin('Error', 'Your request failed', 'error')
          throw new Error('Failed to get your friends requests');
        }
      })
      .then(data => {
        if (data && data.success) {
          setFriendRequests(data.friendRequests);
        }
      })
      .catch(error => {
        redirectLogin('Error', 'Your request failed', 'error')
        console.error('Hubo un problema con la petición Fetch:', error);
      })
    ])
    .finally(() => {
      setTimeout(()=>{
        setLoading(false);
      }, 100)
    });
  }, [redirectLogin]);

  useEffect(() => {
    if (!isAuthenticated) {
      redirectLogin('Warning', 'You have to be authenticated before to access here!!', 'warning')
    }
  },[isAuthenticated, redirectLogin])

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

    };

    socket.on('newContactsSuccess', handleNewContacts);

    // La función de limpieza debe desactivar el mismo evento que se activó.
    return () => {
      socket.off('newContactsSuccess', handleNewContacts);
    };

  }, []);

   useEffect(() => { 

    // si hay algun contacto seleccionado anular la accion de 
    if (selectedContactName) {
      window.history.pushState(null, "");
    }
    const handleBackButton = () => {
       if (selectedContactName) {
         setSelectedContact(null);
         setSelectedContactName(null);
       }
     };

     // Agregar el listener para el evento popstate
     window.addEventListener('popstate', handleBackButton);

     // volver a colocar el estado inicial del historial cuando el componente se monta
     return () => {
       window.removeEventListener('popstate', handleBackButton);
   };

   }, [selectedContactName]);

  useEffect(() => {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messagesContainer');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 0);
  }, [messages]);

  const sendMessage = (messageData) => {
      
      socket.emit('sendMessage', messageData);
  };

  const onTouchStart = (e, handler) => {
    e.preventDefault();
    // Establecer un nuevo temporizador
    const id = setTimeout(handler, 1000);
    setTemporizador(id);
  };

  const onTouchEnd = () => {
    // Cancelar el temporizador si el usuario suelta antes de tiempo
    clearTimeout(temporizador);
  };

  const handleHoldTouchContact = () => {
    setShowContextMenu(true);
  };

  const handleHoldTouchMessage = () => {
    setShowContextMenuMessage(true);
  };


    // Inicializa el estado con el ancho y alto actuales del navegador
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        // Función para actualizar el estado con el nuevo tamaño
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Añadir listener para el evento resize
        window.addEventListener('resize', handleResize);

        // Limpieza del listener cuando el componente se desmonta
        return () => window.removeEventListener('resize', handleResize);
    }, []); // El array vacío asegura que el efecto se ejecute solo en la montura y desmontura


  const handleContactClick = useCallback((e, { contact_id, username }) => {

    setShowContextMenuMessage(false);

    setCoordenades({ x: e.clientX, y: e.clientY })

    setMenuVisibility(false);
    e.preventDefault();

    if (e.button === SECONDARY_CLICK ) {
      e.preventDefault();
      setSecondSelectedContactId(contact_id);
      setShowContextMenu(true);
    }

    if (e.button === PRINCIPAL_CLICK) {
      e.preventDefault();
      setSelectedContact(contact_id);
      setSelectedContactName(username.toUpperCase());
    }

  }, []);

  // useEffect que carga el chat history de la conversacion que hemos seleccionado
  useEffect(() => {

      fetch(`${REACT_APP_SERVER_URL}/chat-history/${selectedContact}`, {
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

  }, [selectedContact]);

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
    if (contextMenuMessageRef.current && !contextMenuMessageRef.current.contains(e.target)) {
      setShowContextMenuMessage(false);
    }
  };
  const handleMenuVisibility = (e) => {
    e.stopPropagation(); // Detiene la propagación del evento
    setMenuVisibility(!menuVisibility);
    setShowContextMenu(false) // Cambia la visibilidad del menú
    setMenuClicked(!menuClicked);
    setShowContextMenuMessage(false);
    if (menuVisibility === true) {
      setFriendRequestVisibility(false);
      setAddFormVisibility(false);
    }
  };
  const handleFriendRequestVisibility = () => {
    setFriendRequestVisibility(!friendRequestVisibility);
    setAddFormVisibility(false);
  };

  const getIndex = (array, property, reference) => {
    return array.findIndex(obj => obj[property] === reference);
  }

  const handleAcceptRequest = (senderId) => {
    socket.emit('acceptFriendRequest', senderId);

    const indexAcceptRequest  = getIndex(friendRequests, 'sender_id', senderId);
    console.log(indexAcceptRequest);

    if (indexAcceptRequest !== -1) {
      let updateFriendRequests = [...friendRequests];
      updateFriendRequests.splice(indexAcceptRequest, 1);
      setFriendRequests(updateFriendRequests);
    }

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

  useEffect(() => {
    socket.on('acceptFriendRequestSuccess', (contact) => {

      let updateContacts = [...contacts, contact[0]];
      setContacts(updateContacts);
    });

    socket.on('newFriendRequest', (friendRequest)=>{
       let newFriendRequests = [...friendRequests, friendRequest];
       setFriendRequests(newFriendRequests);
    });

    socket.on('removeContact', (contactId) => {
      let indexContactDelete = contacts.findIndex(obj => obj.contact_id === contactId); // <-- Encontramos el index del contacto que hemos seleccionado
      if (indexContactDelete !== -1) {
        let updateContacts = [...contacts];
        updateContacts.splice(indexContactDelete, 1);
        setContacts(updateContacts);
      }
    });

    return () => {
      socket.off('acceptFriendRequestSuccess');
      socket.off('newFriendRequest');
    };
  }, [contacts, friendRequests]);

  const handleIgnoreRequest = (senderId) => {
    setIsProcessingRequest(senderId);
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
    fetch(`${REACT_APP_SERVER_URL}/logout`, {
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

  // useEffect(() => {}, [secondSelectedContactId]);

  const handleClearChat = useCallback(() => {
    console.log('secondSelectedContactId', secondSelectedContactId)
    setShowContextMenu(false);
    socket.emit('clearChat', secondSelectedContactId);
    console.log(secondSelectedContactId, typeof secondSelectedContactId);
    socket.on('clearChatSuccess', (message) => {
      if (secondSelectedContactId === selectedContact) {
        setMessages([]);
      }
      console.log(contacts);
      console.log('secondSelectedContactId', secondSelectedContactId)

      let newContactVisual = [...contacts];
      let indexContactClear = getIndex(newContactVisual, 'contact_id', secondSelectedContactId) 
      
      if (indexContactClear !== -1) {
        newContactVisual[indexContactClear].lastMessage = null;
      }

      setContacts(newContactVisual);
      console.log(message);
    })
    socket.on('clearChatError', (message) => {
      console.log(message);
    })
  }, [secondSelectedContactId, contacts, selectedContact]);

  const handleDeleteContact = () => {
    setShowContextMenu(false);
    let indexContactDelete = contacts.findIndex(obj => obj.contact_id === secondSelectedContactId); // <-- Encontramos el index del contacto que hemos seleccionado
    if (indexContactDelete !== -1) {
      let updateContacts = [...contacts];
      updateContacts.splice(indexContactDelete, 1);
      setContacts(updateContacts);
    }
    socket.emit('deleteContact', secondSelectedContactId);
    socket.on('deleteContactSuccess', (message) => {


      console.log(message);
    })
    socket.on('deleteContactError', (message) => {
      console.log(message);
    })
  };

  const handleClickMessage = (message, e) => {
    setShowContextMenu(false);
    setMenuVisibility(false);
    e.stopPropagation();
    e.preventDefault();

    setCoordenades({ x: e.clientX, y: e.clientY });

    if (e.button === SECONDARY_CLICK || temporizador) {
      setShowContextMenuMessage(true);
      setMessageSelected(message);
    }

  }

  const handleDeleteMessageForAll = () => {
    socket.emit('deleteMessageForAll', messageSelected);
  }

  const handleDeleteMessageForMe = () => {
    socket.emit('deleteMessageForMe', messageSelected);
  }

  useEffect(() => {

    socket.on('deleteMessageForAllSuccess', (newLastMessage) => {
      setShowContextMenuMessage(false);

      let indexMessageAllDelete = messages.findIndex(obj => obj.id === messageSelected.id); // <-- Encontramos el index del mensaje que hemos seleccionado
      if (indexMessageAllDelete !== -1) {
        let updateMessages = [...messages];
        updateMessages.splice(indexMessageAllDelete, 1);
        setMessages(updateMessages);
      }

      if (newLastMessage) {
        let newContacts = [...contacts];
        let indexContact = newContacts.findIndex(obj => obj.contact_id === messageSelected.sender_id || obj.contact_id === messageSelected.receiver_id);

        if (indexContact !== -1) {
          newContacts[indexContact].lastMessage = newLastMessage.content;
          setContacts(newContacts);
        }
      }
    });

    socket.on('deleteMessageForAllError', (error) => {
      console.log(error);
    });

    socket.on('deleteMessageForMeSuccess', (newLastMessage) => {
      setShowContextMenuMessage(false);

      let indexMessageMeDelete = messages.findIndex(obj => obj.id === messageSelected.id); // <-- Encontramos el index del mensaje que hemos seleccionado

      if (indexMessageMeDelete !== -1) {
        let updateMessages = [...messages];
        updateMessages.splice(indexMessageMeDelete, 1);
        setMessages(updateMessages);
      }

       if (newLastMessage) {
         let newContacts = [...contacts];
         let indexContact = newContacts.findIndex(obj => obj.contact_id === messageSelected.sender_id || obj.contact_id === messageSelected.receiver_id);

         if (indexContact !== -1) {
           newContacts[indexContact].lastMessage = newLastMessage.content;
           setContacts(newContacts);
         }
       }

    });
    socket.on('deleteMessageForMeError', (message) => {
      console.log(message);
    });

    return () => {
      socket.off('deleteMessageForMeSuccess');
      socket.off('deleteMessageForMeError');
      socket.off('deleteMessageForAllSuccess');
      socket.off('deleteMessageForAllError');
    };

  }, [messages, messageSelected, contacts]);

  useEffect(() => {
    socket.on('updateMessageDelete', (messageDeleteInfo) => {
      let indexMessageDelete = messages.findIndex(obj => obj.id === messageDeleteInfo.id); // <-- Encontramos el index del mensaje que hemos seleccionado
      console.log('socketdeleteforall',messages, messages[indexMessageDelete], indexMessageDelete)
      if (indexMessageDelete !== -1) {
        let updateMessages = [...messages];
        updateMessages.splice(indexMessageDelete, 1);
        setMessages(updateMessages);
      }
    });

    const handleNewContacts = (newContacts) => {
      
      setContacts(newContacts);

    };

    socket.emit('newContacts');

    socket.on('newContactsSuccess', handleNewContacts);

    return () => {
      socket.off('updateMessageDelete');
      socket.off('newContactsSuccess', handleNewContacts);
    }
    
  }, [messages]);



  useEffect(() => {

    if (!showContextMenuMessage) {
      setMessageSelected('');
    }
  }, [showContextMenuMessage]);

  const handleClickBack = () => {
    setSelectedContact(null);
    setSelectedContactName(null);
  }

   if (loading) {
     return <div className='loaderContainer'>{SVG_LOADING}</div>
   }


   return (
     <MessagesContext.Provider value={{ messages, setMessages, userId, setUserId, isWaitingClick, selectedContact, selectedContactName, messageSelected, username}}>

    <div className="chat-container" onClick={handleClickOutside} >
      <ContextMenu x={coordenades.x} y={coordenades.y} showContextMenu={showContextMenu} contextMenuRef={contextMenuRef} handleClearChat={handleClearChat} handleDeleteContact={handleDeleteContact} />
      <ContextMenuMessage x={coordenades.x} y={coordenades.y} showContextMenuMessage={showContextMenuMessage} contextMenuMessageRef={contextMenuMessageRef} handle1={handleDeleteMessageForMe} content1={'Delete message for me'} handle2={messageSelected.sender_id === userId ? handleDeleteMessageForAll : null} content2={messageSelected.sender_id === userId ? 'Delete message for all' : ''} ownMessage={messageSelected.sender_id === userId ? true : false}  />
      <div className= {`containerSide ${selectedContactName ? '' : 'active'}`}  >
      <aside className={`chat-sidebar ${selectedContactName ? '' : 'active'}`}>
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

          </div>
        </div>

      </div>
      <div className='contactsContainer'>
        <ChatListComponent selectedContact={selectedContact} contacts={contacts} onContactClick={handleContactClick} userId={userId} onTouchStart={(e) => onTouchStart(e, handleHoldTouchContact)} onTouchEnd={onTouchEnd} />
      </div>
      </aside>
      </div>
      <div className={`containerChat ${selectedContactName ? 'active' : ''}`}>
      <div className={`chat-main ${ selectedContactName!==null ? 'active' : ''}`}>
        <ChatMain sendMessage={sendMessage} handleClickMessage={handleClickMessage} handleClickBack={handleClickBack} handleHoldTouchMessage={handleHoldTouchMessage} onTouchStart={(e) => onTouchStart(e, handleHoldTouchMessage)} onTouchEnd={onTouchEnd} />
      </div>
      </div>
    </div>

    </MessagesContext.Provider>
  );
};

export default ChatComponent;