import React, {useState} from 'react';
import './InputChat.css';

const InputChat = ({ onSubmitMessage }) => {

    const [inputMessage, setInputMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);

    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputMessage.trim() === '') {
            console.log('No se puede enviar un mensaje vacío');
            setErrorMessage('No se puede enviar un mensaje vacío!!');
            return;
        }
        if (inputMessage.length > 200) {
            console.log('No se puede enviar un mensaje mayor a 200 caracteres');
            setErrorMessage('No se puede enviar un mensaje mayor a 200 caracteres!!');
            return;
        }
        onSubmitMessage(inputMessage);
        setInputMessage('');
    }

    if (errorMessage) {
        setTimeout(() => {
            setErrorMessage(false);
        }, 4000);
    }

    return(
        <form className="inputGroup" onSubmit={handleSubmit}>
        <div className={`errorMessage ${errorMessage ? '' : 'hidden'}`}>{errorMessage}</div>
        <input type="text" className="input" id="inputMessage" placeholder="Type your message" autoComplete="off" onChange={handleInputChange} value={inputMessage} />
        <button className="buttonSubmit" value="Send" type="submit" />
        </form>
    )
}

export default InputChat;