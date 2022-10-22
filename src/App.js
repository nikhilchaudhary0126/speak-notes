import logo from './logo.svg';
import { Registration } from './Registration';
import { Login } from './Login';
import React, { useState } from "react";
import './util/App.css';
import {  
  BrowserRouter as Router,  
  Routes,  
  Route,  
  Switch,
  Redirect  
}   
from 'react-router-dom'; 
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/Registration" element={<Registration/>}  />
        </Routes>
      </Router>
  );
}

export default App;
