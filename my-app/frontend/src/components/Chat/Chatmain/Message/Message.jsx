// MessageComponent.js
import React from 'react';
import '../../Chat.css';


const Message = ({ message, isOwnMessage, isLastMessageGroup }) => {

  
  return (
    <div className={`message${isOwnMessage ? 'Right' : 'Left'}${isLastMessageGroup ? ' lastMessageGroup' : ''}`}>
      <span> {message} </span>
    </div>
  );
};

export default Message;