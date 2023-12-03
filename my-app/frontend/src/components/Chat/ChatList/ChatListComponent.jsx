// ChatListComponent.jsx
import React, { useContext, useState } from 'react';
import ProfilePictureComponent from '../ProfilePicture/ProfilePictureComponent';
import './ChatList.css';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  textTransparent: {
      opacity:'0',
      width:'0px'
  }
});
  

const ChatListComponent = ({ contacts, onContactClick }) => {
  console.log(contacts)
  const classes = useStyles();
  return (
    <> 
    {contacts.map((contact, index) => {
      
      return(
      <div key={index} className="chat-item" onClick={(e) => onContactClick(e, contact)} onContextMenu={(e) => onContactClick(e, contact)}>
          <ProfilePictureComponent />
          <div className="contactContainer">
            <span className="contactName">{contact.username.toUpperCase()}</span>
            <span className={`lastMessage ${contact.lastMessage ? '' : classes.textTransparent}`}>{contact.lastMessage ? contact.lastMessage : '.'}</span>
          </div>
        </div> )
    })}
      </>
  );
};

export default ChatListComponent;