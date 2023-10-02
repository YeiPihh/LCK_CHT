import React, { useEffect, useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import Register from './components/Register/RegisterComponent.jsx';
import Login from './components/Login/LoginComponent.jsx';
import Index from './components/Index/IndexComponent.jsx';
import Chat from './components/Chat/ChatComponent.jsx';
import './index.css';

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />}/>
        <Route path="/chat" element={<Chat />}>
        </Route>
      </Routes>
    </Router>
    </>
    
  );
}

export default App;