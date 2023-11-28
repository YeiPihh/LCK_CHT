import React, { useState, useContext } from "react";
import Message from './Message/Message.jsx';
import { MessagesContext } from '../ChatComponent.jsx';
import '../Chat.css';


const ChatMain = () => {
    const { messages, userId, isWaitingClick, setIsWaitingClick } = useContext(MessagesContext);
    
    const handleOwnMessage = (senderId) => {
        return parseInt(senderId) === parseInt(userId);
    }
    
    if (isWaitingClick) {
        return
    } else {
            return (
            <main style={{width:'100%', height:'100vh'}}>
                
                <div className="messagesContainer">
                    {messages.map((message, index)=> {
                        const lastMessageGroup = index > 0 && messages[index-1].sender_id !== message.sender_id;
                        return (
                        <Message key={message.id} message={message.content} isOwnMessage={handleOwnMessage(message.sender_id)} isLastMessageGroup={lastMessageGroup} />)
                    })}
                </div>

            </main>
        
        )
    }
};

export default ChatMain;