import React from "react";
import './ContextMenu.css';
import { SVG_ICON_TRASH, SVG_ICON_EMPTY } from './svgContextMenu.js';

const ContextMenu = ({ x, y, showContextMenu, contextMenuRef, handleClearChat, handleDeleteContact }) => {
    if (!showContextMenu) return null;

    const contextMenuStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 4,
        backgroundColor: '#111111e1',
        borderRadius: '15px',
        padding: '20px 25px',
        width: 'max-content',
        backdropFilter: 'blur(5px)',
        gap: '20px',
    };

    const buttonContextMenu = {
        display: 'flex',
        backgroundColor: 'transparent',
        minWidth: 'max-content',
        width: '100%',
        fontSize: '16px',
        padding: '8px',
        border: 'none',
        outline: 'none',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontFamily: 'Poppins',
        letterSpacing: '0.5px'
    }

    return (
        <div style={contextMenuStyles} className="contextMenuContainer" ref={contextMenuRef}>
                <div className="buttonContextContainer">{SVG_ICON_EMPTY}
                    <button style={buttonContextMenu} onClick={handleClearChat}>Vaciar chat</button></div>
                <div className="buttonContextContainer">{SVG_ICON_TRASH}
                    <button style={buttonContextMenu} onClick={handleDeleteContact}>Eliminar contacto</button>
                </div>
        </div>
    )
};

export default ContextMenu;