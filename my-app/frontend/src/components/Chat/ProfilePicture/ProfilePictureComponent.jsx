// ProfilePictureComponent.js
import React from 'react';
import './ProfilePicture.css';

const ProfilePictureComponent = ({ imageUrl, username }) => {

  return (
    <div className="profileImagenContainer no-select">
      <img src={imageUrl} alt="usuario" width="40px" height="40px" id="imagenProfile"/>
      <span className="usernameSide">{username}</span>
    </div>
  );
};

export default ProfilePictureComponent;