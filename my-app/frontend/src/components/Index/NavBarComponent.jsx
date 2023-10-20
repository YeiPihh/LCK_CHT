import React from "react";
import { Link } from "react-router-dom";

const navBar = () => {
    return (
        <header className="headerIndexComponent">
        <div className="tittleHeader">LCK CHT</div>
        <nav className= "navBar">
          <div className="registerContainer"><Link to='/Register'>Register</Link></div>
          <div className="loginContainer"><Link to='/Login'>Login</Link></div>
          <div className="infoContainer"><Link to="/">Info</Link></div>
        </nav>
      </header>
    )
};

export default navBar;