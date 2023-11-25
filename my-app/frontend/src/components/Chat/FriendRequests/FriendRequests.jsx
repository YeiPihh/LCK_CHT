import React from 'react';
import './FriendRequests.css'

const FriendRequest = ({ classFriendRequest, request, acceptRequest, ignoreRequest }) => {    
    return (
        <>
        <div className= {`friendRequest ${classFriendRequest}`}>
            <div>{ request.senderUsername } te ha enviado una solicitud</div>
            <div className='buttonsContainer'>
                <button onClick={() => acceptRequest()} className='accept'>Aceptar</button>
                <button onClick={() => ignoreRequest()} className='ignore'>Ignorar</button>
            </div>
        </div>
        </>
        
    )
};

export default FriendRequest;