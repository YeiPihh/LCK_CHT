import React, {useContext} from "react";
import ProfilePictureComponent from "../../ProfilePicture/ProfilePictureComponent.jsx";
import { MessagesContext } from "../../ChatComponent.jsx";
import './HeaderChatMain.css';

import { SVG_ICON_ARROW } from "../svgChatMain.js";


const HeaderChatMain = ({ handleClickBack }) => {

    const {selectedContactName} = useContext(MessagesContext);

    return (
        <header className='headerChatMain' >
            <button className="buttonBackArrow" onClick={handleClickBack}>
            {SVG_ICON_ARROW}
            </button>
            <ProfilePictureComponent username={selectedContactName} />
        </header>
        
    );
};

export default HeaderChatMain;