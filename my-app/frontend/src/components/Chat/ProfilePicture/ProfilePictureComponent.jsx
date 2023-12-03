// ProfilePictureComponent.js
import React from 'react';
import './ProfilePicture.css';

const ProfilePictureComponent = ({username}) => {
  const imageUrl='https://i.postimg.cc/fTDtfZZ7/usuario.png';
  return (
    <div className="profileImagenContainer no-select">
      <img src={imageUrl} alt="usuario" width="40px" height="40px" id="imagenProfile" />
      <div className='usernameSide'>{username}</div>
    </div>
  );
};

export default ProfilePictureComponent;