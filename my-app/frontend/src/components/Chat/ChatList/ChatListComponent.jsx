// ChatListComponent.jsx
import React, { useEffect } from 'react';
import ProfilePictureComponent from '../ProfilePicture/ProfilePictureComponent';
import './ChatList.css';
import { createUseStyles } from 'react-jss';
const useStyles = createUseStyles({
  textTransparent: {
      opacity:'0',
      width:'0px'
  }
});
  

const ChatListComponent = ({ contacts, onContactClick, userId,  onTouchStart, onTouchEnd, selectedContact }) => {
  
  const classes = useStyles();


  return (
    <> 
    {contacts.map((contact, index) => {
      const isSelected = selectedContact ? selectedContact === contact.contact_id : false;
      
      return(
      <div key={index} className={`chat-item ${isSelected ? 'selected' : ''}`} onClick={(e) => onContactClick(e, contact)} onContextMenu={(e) => onContactClick(e, contact)}  onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <ProfilePictureComponent />
          <div className="contactContainer">
            <span className="contactName">{contact.username.toUpperCase()}</span>
            <span className={`lastMessage ${contact.lastMessage ? '' : classes.textTransparent}`}>{contact.lastMessage && ((contact.sender_id === userId && contact.showSender === 1) || (contact.receiver_id === userId && contact.showReceiver === 1)) ? contact.lastMessage : '.'}</span>
          </div>
        </div> )
    })}
      </>
  );
};

export default ChatListComponent;