import React from 'react';
import './FriendRequests.css';

const FriendRequest = ({ classFriendRequest, request, acceptRequest, ignoreRequest }) => {    
    return (
        <>
        <div className= {`friendRequest ${classFriendRequest}`}>
            <div className='request'>
                <div className='usernameRequest'>{ request.senderUsername }</div>
                <div className='buttonsContainer'>
                    <button onClick={() => acceptRequest()} className='accept'>Aceptar</button>
                    <button onClick={() => ignoreRequest()} className='ignore'>Ignorar</button>
                </div>
            </div>
            
        </div>
        </>
        
    )
};

export default FriendRequest;