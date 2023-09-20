{/*import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Swal from 'sweetalert2'; // Asumiendo que tienes SweetAlert2 en tu proyecto de React

const ChatComponent = () => {
  const [contactId, setContactId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newContactUsername, setNewContactUsername] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const socket = socketIOClient('http://localhost:4567');

    socket.on('receiveMessage', (messageData) => {
      setMessages(prevMessages => [...prevMessages, messageData]);
    });  

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    const messageData = {
      senderId: userId,
      receiverId: contactId,
      content: newMessage,
    };
    
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };
  
  return (
    <div>
      { Renderizar mensajes }
      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}

      {Input para nuevo mensaje }
      <input value={newMessage} onChange={e => setNewMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default ChatComponent; */}