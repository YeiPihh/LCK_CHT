import React, {useContext} from "react";
import ProfilePictureComponent from "../../ProfilePicture/ProfilePictureComponent.jsx";
import { MessagesContext } from "../../ChatComponent.jsx";
import './HeaderChatMain.css';


const HeaderChatMain = ({ handleClickBack }) => {

    const {selectedContactName} = useContext(MessagesContext);

    return (
        <header className='headerChatMain' >
            <button className="buttonBackArrow" onClick={handleClickBack}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#FFFFFF'><path d='M12 20V4l-8 8 8 8z' fill='#FFFFFF'></path><path d='m2.29 12.71l8 8c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-6.29-6.29h15.59c.55 0 1-.45 1-1s-.45-1-1-1H5.41l6.29-6.29c.39-.39.39-1.02 0-1.41-.2-.2-.45-.29-.71-.29s-.51.1-.71.29L2.29 11.29c-.39.39-.39 1.02 0 1.41Z'></path></svg>
            </button>
            <ProfilePictureComponent username={selectedContactName} />
        </header>
        
    );
};

export default HeaderChatMain;