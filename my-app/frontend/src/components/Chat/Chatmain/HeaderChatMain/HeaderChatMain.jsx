import React, {useContext} from "react";
import ProfilePictureComponent from "../../ProfilePicture/ProfilePictureComponent.jsx";
import { createUseStyles } from 'react-jss';
import { MessagesContext } from "../../ChatComponent.jsx";
import './HeaderChatMain.css';

const useStyles = createUseStyles({
    headerChatMains: {
        display: 'flex',
        backgroundColor:'#008cff88',
        backdropFilter: 'blur(25px)',
        width: '100%',
        height: '5%',
        padding: '25px'
    }
});

const HeaderChatMain = () => {

    const {selectedContactName} = useContext(MessagesContext);

    const classes = useStyles();

    return (
        <header className='headerChatMain' >
            <ProfilePictureComponent username={selectedContactName} />
        </header>
    );
};

export default HeaderChatMain;