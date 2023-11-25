import React from "react";
import FriendRequest from "../FriendRequests/FriendRequests";

const MenuChat = ({menuVisibility, formRef, handleRedirectHome, addFormVisibility, handleAddContact, newContactUsername, setNewContactUsername, handleAddFormVisibility, friendRequestVisibility, isProcessingRequest, handleAcceptRequest, handleIgnoreRequest, friendRequests, handleFriendRequestVisibility, handleLogout }) => {
    return (
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
          <div className='noRequests'>No hay solicitudes pendientes</div>
            {
              friendRequests.length === 0 ? (
                <span></span>
              ) : (
                friendRequests.map(request => (
                  // al ocultar una solicitud se ocultan todas arreglar revisar handlesrequests
                  <FriendRequest 
                            classFriendRequest={isProcessingRequest ? 'hidden' : ''}
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
    )
}

export default MenuChat;