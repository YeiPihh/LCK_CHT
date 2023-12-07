//chatMain
import React, { useState, useContext } from "react";
import Message from './Message/Message.jsx';
import { MessagesContext } from '../ChatComponent.jsx';
import InputChat from './InputChat/InputChat.jsx';

import '../Chat.css';
import HeaderChatMain from "./HeaderChatMain/HeaderChatMain.jsx";


const ChatMain = ({ sendMessage, handleClickMessage }) => {

    const { messages, userId, isWaitingClick, selectedContact } = useContext(MessagesContext);

    const handleSubmit = (messageContent) => {
            if (messageContent){
                const messageData = {
                    sender_id: userId,
                    receiver_id: selectedContact,
                    content: messageContent
                };
                sendMessage(messageData);
            }
        
    }

    const handleOwnMessage = (senderId) => {
        return parseInt(senderId) === parseInt(userId);
    }

    if (isWaitingClick) {
        return

    } else {
            return (
                <>
                    <HeaderChatMain />
                        <div className="messagesContainer">
                            {
                                messages.map((message, index)=> {
                                    const lastMessageGroup = index > 0 && messages[index-1].sender_id !==   message.sender_id;
                                
                                    return (
                                        <Message 
                                            key={index}
                                            message={message.content} 
                                            isOwnMessage={handleOwnMessage(message.sender_id)}
                                            isLastMessageGroup={lastMessageGroup}
                                            onContextMenu={(e) => handleClickMessage(message, e)}
                                        />
                                    )
                                })
                            }
                        </div>
                        <InputChat onSubmitMessage={handleSubmit} />
                </>
        
        )
    }
};

export default ChatMain;