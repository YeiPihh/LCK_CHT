// MessageComponent.js
import React from 'react';
import './Message.css';

const MessageComponent = ({ content, isOwnMessage }) => {
  return (
    <div className={`message-${isOwnMessage ? 'right' : 'left'}`}>
      <p>{content}</p>
    </div>
  );
};

export default MessageComponent;