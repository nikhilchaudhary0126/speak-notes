import React, { useEffect, useState } from "react";
import NoteItem from "./NoteItem";
import { getMyNotes } from "./functions";
import Box from "@mui/material/Box";
import AddNotes from "./AddNotes";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Switch from "@mui/material/Switch";
import { faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import StyledNav from "./StyledNav.js";
import "./util/Notes.css";
import { useParams } from 'react-router-dom';
import Axios from "axios"
export function Notes() {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const { userId } = useParams();
  const HOST = "http://127.0.0.1:5000";
  const navigate = useNavigate();
  useEffect(() => {
    fetchMyNotes();
  }, []);

  const onSubmit = (newNote) => {
    setFilteredNotes([newNote, ...notes]);
    setNotes([newNote, ...notes]);
    setIsModalOpen(false);
    setIsSuccess(true);
  };

  const onDelete = (deletedNote) => {
    const newList = notes.filter((item) => item._id !== deletedNote._id);
    setNotes(newList);
    setFilteredNotes(newList);
  };
  const getNotes = (uid) => {
    
    Axios.get(`${HOST}/get_notes/${uid}`)
    .then((response) => {
        console.log(response)
        setNotes(response.data.message);
        setFilteredNotes(response.data.message);
    })
    .catch((error) => {
        const data = error.response.data
        if (error.response.status === 400) {
            console.log("comething went wrong")
        }
      })
  };
  const fetchMyNotes = async () => {
    // getNotes(userId);
    let note1 = {
      id: "1",
      title: "first",
      content: "this is first"
    }
    let note2 = {
      id: "1",
      title: "second",
      content: "this is second"
    }
    let note3 = {
      id: "1",
      title: "third",
      content: "this is third"
    }
    
    setNotes([note1,note2,note3]);
    setFilteredNotes([note1,note2,note3]);
    // const data = await response.data;
    // setNotes(data);
    // setFilteredNotes(data);
  };

  const filterOnClick = (e) => {
    if (e.target.checked) {
      return setFilteredNotes(notes.filter((item) => item.favorited));
    }
    setFilteredNotes(notes);
  };

  return (
    <div className="Notes">
      <div className="navbar"> <StyledNav setIsModalOpen = {setIsModalOpen}></StyledNav></div>
      <div className="main"><Box>  
      <Snackbar
        open={isSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={2000}
        onClose={() => setIsSuccess(false)}
      >
        <Alert variant="filled" severity="success">
          Note added successfully
        </Alert>
      </Snackbar>
      <Grid alignItems={"stretch"} container spacing={2}>
        {filteredNotes.map((note, index) => (
          <Grid item xs={6} md={3}>
            <NoteItem
              note={note}
              key={index}
              onDelete={onDelete}
              onUpdate={fetchMyNotes}
            />
          </Grid>
        ))}
      </Grid>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <AddNotes Id = {userId} onSubmit={onSubmit} />
      </Modal>
    </Box></div>
   
    
    </div>
  );
}

export default Notes;