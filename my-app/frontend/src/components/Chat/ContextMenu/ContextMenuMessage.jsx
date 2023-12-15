import React, {useRef, useEffect} from "react";
import { SVG_ICON_TRASH, SVG_ICON_X } from './svgContextMenu.js';


const ContextMenuMessage = ({ x, y, showContextMenuMessage, contextMenuMessageRef, handle1, handle2, content1, content2, ownMessage }) => {


    useEffect(() => {
        if (contextMenuMessageRef.current) {
            const { offsetWidth, offsetHeight } = contextMenuMessageRef.current;
            console.log(`El tamaño de contextMenuContainer es ${offsetWidth}x${offsetHeight}`);
        }
    }, []);

    const positionY= ownMessage ? x-275 : x;
    
    const contextMenuStyles = {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: y,
        left: positionY,
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