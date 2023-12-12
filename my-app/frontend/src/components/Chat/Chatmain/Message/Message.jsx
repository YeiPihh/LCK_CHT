// MessageComponent.js
import React from 'react';
import '../../Chat.css';


const Message = ({ message, isOwnMessage, isLastMessageGroup, onContextMenu, messageSelected }) => {

  
  return (
    <div className='message'>
    <div className={`message${isOwnMessage ? 'Right' : 'Left'}${isLastMessageGroup ? ' lastMessageGroup' : ''}`} onContextMenu={onContextMenu} >
      <span> {message} </span>
    </div>
    </div>
  );
};

export default Message;