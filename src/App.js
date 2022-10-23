import logo from './logo.svg';
import { Registration } from './Registration';
import { Login } from './Login';
import React, { useState } from "react";
import './util/App.css';
import { Notes } from './Notes';
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
          <Route path="/Notes/:userId" element={<Notes/>}  />
        </Routes>
      </Router>
  );
}

export default App;
