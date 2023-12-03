import React, {useState} from 'react';
import './InputChat.css';

const InputChat = ({ onSubmitMessage }) => {

    const [inputMessage, setInputMessage] = useState('');

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputMessage.trim() !== '') {
            onSubmitMessage(inputMessage);
        }
        setInputMessage('');
    }

    return(
        <form className="inputGroup" onSubmit={handleSubmit}>
        <input type="text" className="input" id="inputMessage" placeholder="Type your message" autoComplete="off" onChange={handleInputChange} value={inputMessage} required />
        <button className="buttonSubmit" value="Send" type="submit" />
        </form>
    )
}

export default InputChat;