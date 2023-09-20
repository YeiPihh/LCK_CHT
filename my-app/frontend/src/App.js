import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from 'react-router-dom';
import Register from './components/RegisterComponent.jsx';
import Login from './components/LoginComponent.jsx';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;