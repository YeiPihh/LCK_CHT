//chatMain
import React, { useContext, useEffect } from "react";
import Message from './Message/Message.jsx';
import { MessagesContext } from '../ChatComponent.jsx';
import InputChat from './InputChat/InputChat.jsx';

import '../Chat.css';
import HeaderChatMain from "./HeaderChatMain/HeaderChatMain.jsx";


const ChatMain = ({ sendMessage, handleClickMessage, handleClickBack, onTouchStart, onTouchEnd }) => {

    const { messages, userId, isWaitingClick, selectedContact, messageSelected } = useContext(MessagesContext);

    const handleSubmit = (messageContent) => {
            if (messageContent){
                const messageData = {
                    sender_id: userId,
                    receiver_id: selectedContact,
                    content: messageContent
                };
                setTimeout(() => {
                    sendMessage(messageData);
                }, 500);
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
                    <HeaderChatMain handleClickBack={handleClickBack} />
                        <div className="messagesContainer">
                            {
                                messages.map((message, index)=> {
                                    const lastMessageGroup = index > 0 && messages[index-1].sender_id !==   message.sender_id;
                                    const isSelected = messageSelected.id === message.id;
                                    
                                
                                    return (
                                        <Message 
                                            key={message.id}
                                            message={message.content} 
                                            isOwnMessage={handleOwnMessage(message.sender_id)}
                                            isLastMessageGroup={lastMessageGroup}
                                            onContextMenu={(e) => handleClickMessage(message, e)}
                                            onTouchStart={onTouchStart}
                                            onTouchEnd={onTouchEnd}
                                            messageSelected={messageSelected}
                                            isSelected={isSelected}
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