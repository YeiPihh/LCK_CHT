import React, {useContext} from "react";
import ProfilePictureComponent from "../../ProfilePicture/ProfilePictureComponent.jsx";
import { createUseStyles } from 'react-jss';
import { MessagesContext } from "../../ChatComponent.jsx";

const useStyles = createUseStyles({
    headerChatMains: {
        display: 'flex',
        backgroundColor:'var(--main-bg-color)',
        width: '100%',
        height: 'max-content',
        padding: '20px 20px'
    }
});

const HeaderChatMain = () => {

    const {selectedContactName} = useContext(MessagesContext);

    const classes = useStyles();

    return (
        <header className={`${classes.headerChatMains}`} >
            <ProfilePictureComponent username={selectedContactName} />
        </header>
    );
};

export default HeaderChatMain;