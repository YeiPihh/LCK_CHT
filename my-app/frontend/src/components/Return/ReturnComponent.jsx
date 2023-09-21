import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Return.css';

const Return = () => {
    const navigate = useNavigate();
    return (
        <img src='https://i.postimg.cc/NMhxgv9x/casa.png' border='0' alt='volver' className='returnImg' onClick={() => navigate('/')} />
    )
};

export default Return;