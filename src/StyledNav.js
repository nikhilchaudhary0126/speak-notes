import React from 'react';
import {  Link } from "react-router-dom";
import Button from '@mui/material/Button';
import './util/Nav.css';
const StyledNav= ({setIsModalOpen}) =>{
  const mystyle = {
    display: "flex",
    flexDirection: "horizontal",
    width: "100%",
    justifyContent: "right"
  };

  const links = {
    padding: "10px",
    margin: "10px",
  }
  return (
  <div style = {mystyle}>
    <h2 style = {{top: 0,
        left: 10,
        color: "white",
        position: "absolute"}}>Speak Notes</h2>
    <Button style = {links} onClick={() => setIsModalOpen(true)} variant="contained">Add Note</Button>
    <Button href="/" style = {links} variant="contained">Log Out</Button>
  </div>
  );
}
export default StyledNav;