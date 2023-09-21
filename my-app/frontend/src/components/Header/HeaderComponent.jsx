import React from 'react';
import Return from '../Return/ReturnComponent.jsx';
import './Header.css';

const Header = () => {
    return (
        <header className="header">
            <div className="tittleHeader">
                <Return />
                <span className="lockTalk">LOCK TALK</span>
            </div>
        </header>
    );
};

export default Header;

