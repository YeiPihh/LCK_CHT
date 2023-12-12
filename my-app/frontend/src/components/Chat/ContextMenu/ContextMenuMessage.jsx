import React from "react";

const ContextMenuMessage = ({ x, y, showContextMenuMessage, contextMenuMessageRef, handle1, handle2, content1, content2 }) => { 
    
    const contextMenuStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 10000,
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
        fontSize: '16px',
        padding: '8px',
        border: 'none',
        outline: 'none',
        color: 'white',
        cursor: 'pointer',
        fontWeight: '600',
        fontFamily: 'Poppins',
        letterSpacing: '0.5px',
        width: 'max-content',
    }
    
    if (!showContextMenuMessage) return null;

    
    
    return (
        <div style={contextMenuStyles} className="contextMenuContainer" ref={contextMenuMessageRef}>
                <button style={buttonContextMenu} onClick={handle1}>{content1}</button>
                <button className={handle2 || content2 ? '' : 'hidden'} style={buttonContextMenu} onClick={handle2}>{content2}</button>
        </div>
    )
};

export default ContextMenuMessage;