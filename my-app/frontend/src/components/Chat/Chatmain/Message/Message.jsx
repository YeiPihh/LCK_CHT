// MessageComponent.js
import React from 'react';
import '../../Chat.css';


const Message = ({ message, isOwnMessage, isLastMessageGroup, onContextMenu, isSelected }) => {

  
  return (
    <div className={`message ${isSelected ? 'selected' : ''} ${isLastMessageGroup ? ' lastMessageGroup' : ''}`}>
    <div className={`message${isOwnMessage ? 'Right' : 'Left'}`} onContextMenu={onContextMenu} >
      <span> {message} </span>
    </div>
    </div>
  );
};

export default Message;