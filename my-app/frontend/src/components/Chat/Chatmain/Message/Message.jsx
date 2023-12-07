// MessageComponent.js
import React from 'react';
import '../../Chat.css';


const Message = ({ message, isOwnMessage, isLastMessageGroup, onContextMenu }) => {

  
  return (
    <div className={`message${isOwnMessage ? 'Right' : 'Left'}${isLastMessageGroup ? ' lastMessageGroup' : ''}`} onContextMenu={onContextMenu} >
      <span> {message} </span>
    </div>
  );
};

export default Message;