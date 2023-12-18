import React, {useRef, useEffect, useState} from "react";
import { SVG_ICON_TRASH, SVG_ICON_X } from './svgContextMenu.js';
import useWindowSize from './useWindowSize.jsx';

const ContextMenuMessage = ({ x, y, showContextMenuMessage, contextMenuMessageRef, handle1, handle2, content1, content2, ownMessage }) => {

    const [windowWidth, windowHeight] = useWindowSize();

    useEffect(() => {
        if (contextMenuMessageRef.current) {
            const { offsetWidth, offsetHeight } = contextMenuMessageRef.current;
            console.log(`El tamaño de contextMenuContainer es ${offsetWidth}x${offsetHeight}`);
        }
    }, [contextMenuMessageRef]);

    const positionX= ownMessage ? x-275 : x;
    const positionY = y > windowHeight/2 ? y-150 : y;

    const contextMenuStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: positionY,
        left: positionX,
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
        fontSize: '13px',
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
            <div className="buttonContextContainer">{SVG_ICON_X}
                <button style={buttonContextMenu} onClick={handle1}>{content1}</button>
            </div>
            <div className={`buttonContextContainer ${handle2 || content2 ? '' : 'hidden'}`}>{SVG_ICON_TRASH}
                <button style={buttonContextMenu} onClick={handle2}>{content2}</button>
            </div>
        </div>
    )
};

export default ContextMenuMessage;