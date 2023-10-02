import React from "react";
import { Link } from 'react-router-dom';
import './IndexComponent.css'

const Index = () => {
    return(
        <>  <div className="containerAll" >            
              <div id="form-ui" className="index-container">
                <div id="formBodyIndex">
                  <div id="welcomeLinesIndex">
                    <div id="welcomeIndex"><img src='https://i.postimg.cc/zf5HGkbB/LCKCHT2.png' width={'200px'} border='0' alt='LCKCHT'></img>    </div>
                    <div id="welcomeIndex2">Welcome to Lock Chat, enjoy the privacy and security</div>
                  </div>

                  <div id="submitButtonIndexContainer">
                  <Link to="/Register"><button id="submitButtonIndex" className="indexRegister" type="submit">Register</button></Link>
                  <Link to="/Login"><button id="submitButtonIndex" className="indexLogin" type="submit">Log in</button></Link>
                  </div>

                </div>
              </div>
            </div>
        </>
        
    )
};

export default Index;
