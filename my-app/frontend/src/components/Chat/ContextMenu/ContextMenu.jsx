import React from "react";

const ContextMenu = ({ x, y, showContextMenu, contextMenuRef, handleClearChat, handleDeleteContact }) => {
    if (!showContextMenu) return null;

    const contextMenuStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 4,
        backgroundColor: 'var(--bgTransparent)',
        border: '1px solid #ccc',
        borderRadius: '7px',
        padding: '20px 20px 20px 20px',
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
                <button style={buttonContextMenu} onClick={handleClearChat}>Vaciar chat</button>
                <button style={buttonContextMenu} onClick={handleDeleteContact}>Eliminar contacto</button>
        </div>
    )
};

export default ContextMenu;