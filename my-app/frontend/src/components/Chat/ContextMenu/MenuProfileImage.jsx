import React from 'react';

const MenuImageProfile = () => {
    const menuImageStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 4,
        backgroundColor: 'var(--bgTransparent)',
        border: '1px solid #ccc',
        borderRadius: '7px',
        padding: '20px 20px 20px 20px',
        width: 'max-content',
        backdropFilter: 'blur(5px)',
        gap: '20px',
    };


    return (
        <div className="menu-image-profile" style={menuImageStyles}>
            Select you new profile image
            <div className="selectImageProfileContainer">
                <input type="file" id="selectImageProfile" name="selectImageProfile" accept="image/*" />
            </div>
        </div>
    )
}

export default MenuImageProfile;