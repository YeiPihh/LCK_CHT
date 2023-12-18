// MessageComponent.js
import React, { useContext } from 'react';
import '../../Chat.css';
import { MessagesContext } from '../../ChatComponent.jsx';


const Message = ({ message, isOwnMessage, isLastMessageGroup, onContextMenu, isSelected }) => {

  const { username, selectedContactName } = useContext(MessagesContext);
  
  return (
    <div className={`message ${isSelected ? 'selected' : ''} ${isLastMessageGroup ? ' lastMessageGroup' : ''}`}>
      
    <div className={`message${isOwnMessage ? 'Right' : 'Left'}`} onContextMenu={onContextMenu} >
    <div className={`titleMessage${isOwnMessage ? 'Right' : 'Left'}`}>{isOwnMessage ? username : selectedContactName}</div>
      <div className={`contentMessage${isOwnMessage ? 'Right' : 'Left'}`}> {message} </div>
    </div>
    </div>
  );
};

export default Message;