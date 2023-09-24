// ProfilePictureComponent.js
import React from 'react';
import './ProfilePicture.css';

const ProfilePictureComponent = ({ imageUrl, username }) => {
  return (
    <div className="profileImagenContainer">
      <img src={imageUrl} alt="usuario" width="40px" height="40px" id="imagenProfile"/>
      <span className="username-side">{username}</span>
    </div>
  );
};

export default ProfilePictureComponent;