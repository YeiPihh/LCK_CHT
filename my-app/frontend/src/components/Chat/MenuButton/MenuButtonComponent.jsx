import React, { forwardRef, useState } from 'react';


const MenuButtonComponent = forwardRef((props, ref) => {


    return(
        <button className="btn" id={props.id} onClick={props.onClick} ref={ref}>
            <span className={`icon ${props.iconClass}`}>
                <svg viewBox="0 0 175 80" width="40" height="40">
                    <rect width="75" height="12" fill="#f0f0f0" rx="10"></rect>
                    <rect y="30" width="75" height="12" fill="#f0f0f0" rx="10"></rect>
                    <rect y="60" width="75" height="12" fill="#f0f0f0" rx="10"></rect>
                </svg>
            </span>
            <span className= {`text ${props.textClass}`}>MENU</span>
        </button>
    );
});

export default MenuButtonComponent;