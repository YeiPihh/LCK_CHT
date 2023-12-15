import React from "react";
import FriendRequest from "../FriendRequests/FriendRequests";

import { 
  SVG_ICON_LOGOUT,
  SVG_ICON_ADD,
  SVG_ICON_NOTIFICATION,
  SVG_ICON_HOME
} from './svgMenuChat.js';

const MenuChat = ({menuVisibility, formRef, handleRedirectHome, addFormVisibility, handleAddContact, newContactUsername, setNewContactUsername, handleAddFormVisibility, friendRequestVisibility, isProcessingRequest, handleAcceptRequest, handleIgnoreRequest, friendRequests, handleFriendRequestVisibility, handleLogout }) => {
    return (
      <div id="menuChat" className={`no-select ${menuVisibility ? 'visible' : ''}`} ref={formRef}>
      <div id="homeButton" onClick={handleRedirectHome}>
          {SVG_ICON_HOME}
          <span className="text">Volver al incio</span>
      </div>
      <div className={`contact-icon ${addFormVisibility ? 'selected' : ''}`} onClick={handleAddFormVisibility}>
          {SVG_ICON_ADD}
          <span className="text">Añadir contacto</span>
      </div>
      <form id="addContactForm" className={addFormVisibility ? 'visible' : 'hidden'} onSubmit={handleAddContact}>
        <input type="text" id="newContactUsername" placeholder="Usuario del contacto" autoComplete="off" name="nombre_usuario_añadir" value={newContactUsername} onChange={(e) => setNewContactUsername(e.target.value)} />
        <button type="submit">Añadir</button>
      </form>
      <div className={`solicitud ${friendRequestVisibility ? 'selected' : ''}`} onClick={handleFriendRequestVisibility}>
          {SVG_ICON_NOTIFICATION}
          <span className="text">Solicitudes entrantes</span>
      </div>
      <div id="friendRequestsWrapper" className={friendRequestVisibility ? 'visible' : 'hidden'}>
        <div className='tittleRequests'>FRIEND REQUESTS</div>
          <div className={`noRequests ${friendRequests[0] ? 'hidden' : ''}`}>No hay solicitudes pendientes</div>
            {
               
                friendRequests.map(request => {
                  const hideRequest = request.sender_id === isProcessingRequest;
                  // al ocultar una solicitud se ocultan todas arreglar revisar handlesrequests
                  return(
                    <FriendRequest 
                      classFriendRequest={hideRequest ? 'hidden' : ''}
                      acceptRequest={() => handleAcceptRequest(request.sender_id)}
                      ignoreRequest= {() => handleIgnoreRequest(request.sender_id)} 
                      key={request.id} 
                      request={request}
                    />
                  )
                })
              
            }
               
          </div>
      <div className="nav-list-logout" onClick={handleLogout}>
          {SVG_ICON_LOGOUT}
          <span className="text">Cerrar Sesion</span>
      </div>
      </div>
    )
}

export default MenuChat;