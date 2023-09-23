// ChatListComponent.jsx
import React from 'react';
import ProfilePictureComponent from '../ProfilePicture/ProfilePictureComponent';
import './ChatList.css';

const ChatListComponent = ({ contacts }) => {
  return (
    <div className="nav-list-chat no-select">
      {contacts.map((contact, index) => (
        <div key={index} className="chat-item" data-id={contact.contact_id}>
          <ProfilePictureComponent imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png' username={contact.username}/>
          <div className="contactContainer">
            <span className="contactName">{contact.username.toUpperCase()}</span>
            <span className="lastMessage">{contact.lastMessage}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListComponent;
