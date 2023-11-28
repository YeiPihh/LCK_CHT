import React from "react";
import ProfilePictureComponent from "../../ProfilePicture/ProfilePictureComponent";
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    headerChatMain: {
        display: 'flex',
        backgroundColor:'#444',
        width: '100%',
        height: 'max-content'
    }
});

const HeaderChatMain = (imageUrl, profileUsername) => {

    const classes = useStyles();

    <header className={`${classes.headerChatMain}`} >
        <ProfilePictureComponent imageUrl={imageUrl} username={profileUsername} />
    </header>
};

export default HeaderChatMain;