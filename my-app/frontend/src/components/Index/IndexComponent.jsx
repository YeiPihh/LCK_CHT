import React from "react";
import { Link } from 'react-router-dom';
import './IndexComponent.css'

const Index = () => {
    return(
        <>              
            <div id="form-ui" className="index-container">
              <div id="form-body">
                <div id="welcome-lines">
                  <div id="welcome-line-1"><img src='https://i.postimg.cc/BZwgYL7c/LCKCHT.png' width={'200px'} border='0' alt='LCKCHT'></img>    </div>
                  <div id="welcome-line-2">Welcome to Lock Chat, enjoy the privacy and security</div>
                </div>
            
                <div id="submitButtonIndex">
                <Link to="/Register"><button id="submit-button" className="indexRegister" type="submit">Register</button></Link>
                <Link to="/Login"><button id="submit-button" className="indexLogin" type="submit">Log in</button></Link>
                </div>
          
              </div>
            </div>
        </>
        
    )
};

export default Index;
