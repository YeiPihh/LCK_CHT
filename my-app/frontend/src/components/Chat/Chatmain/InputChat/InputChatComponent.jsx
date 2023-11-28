import React from 'react';
import './InputChat.css';

const InputChat = () => {
    return(
        <div class="input-group">
        <input type="text" class="input" id="Email" name="Email" placeholder="Type your message" autocomplete="off" />
        <input class="button--submit" value="Send" type="submit" />
        </div>
    )
}

export default InputChat;