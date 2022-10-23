import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {useTranslation} from "react-i18next";
import ShareIcon from '@mui/icons-material/Share';
import Axios from "axios"
import "./util/NoteItem.css"
import {
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import { MoreVert, Delete, Edit } from "@mui/icons-material";
import moment from "moment";

import { updateFavorited } from "./functions";

export default function NoteItem({ note, onDelete, onUpdate }) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [noteTitle, setNoteTitle] = useState(note[1]);
  const [Id, setId] = useState(note[0]);
  const [noteContent, setNoteContent] = useState(note[2]);
  const [menuOpened, setMenuOpened] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [isLiked, setIsLiked] = useState(note.favorited);
  const [favoriteButtonDisabled, setFavoriteButtonDisabled] = useState(false);
  const [lang, setLang] = useState('en');
  const HOST = "http://127.0.0.1:5000";
  const languages = [
    { value: '', text: "Options" },
    { value: 'en', text: "English" },
    { value: 'es', text: "Spanish" },
    { value: 'nl', text: "Dutch" },
    { value: 'de', text: "German" },
    { value: 'fr', text: "French" }
    ]
 
  useEffect(() => {
    setNoteTitle(note[1]);
    setNoteContent(note[2]);
    setId(note[0]);
    setIsLiked(note.favorited);
  }, [note]);

  const deleteNote = () => {
    Axios.delete(`${HOST}/delete_note/${Id}`)
    .then((response) => {
      onDelete(Id);
      setMenuOpened(false);
    })
    .catch((error) => {
        const data = error.response.data
        if (error.response.status === 400) {
            console.log("something went wrong")
        }
      })
  };

  const editNote = (data) => {
    Axios.post(`${HOST}/update_note`,data)
    .then((response) => {
      console.log("edited note")
    })
    .catch((error) => {
        const data = error.response.data
        if (error.response.status === 400) {
            console.log("something went wrong")
        }
      })
  };
  const deleteNoteOnClick = async () => {
    setButtonDisabled(true);
    deleteNote();
  };

  const upddateNoteFavorite = async () => {
    setFavoriteButtonDisabled(true);
    const response = await updateFavorited(note._id, !isLiked);
    const data = await response.data;
    onUpdate();

    if (data.success) {
      const currentState = data.note.favorited;
      setIsLiked(currentState);
    }
    setFavoriteButtonDisabled(false);
  };
  const speakNote = () => {
    Axios.get(`${HOST}/speak_note/${Id}`)
    .then((response) => {
        console.log(response)
        let audio = new Audio("/christmas.mp3")
        audio.play()
    })
    .catch((error) => {
        const data = error.response.data
        if (error.response.status === 400) {
            console.log("comething went wrong")
        }
      })
  }
  const speakOnClick = async () => {
    const msg = new SpeechSynthesisUtterance()
    msg.text = noteContent
    window.speechSynthesis.speak(msg)
    // speakNote();
  }
  const editedNote = async () => {
    setButtonDisabled(true);
    const noteInfomation = {
      nid:Id,
      note: noteContent,
    };
    editNote(noteInfomation);
    setButtonDisabled(false);
    setIsEdit(!setIsEdit);
  };

  const convertNoteLang = () =>{
    Axios.post(`${HOST}/convert_note`,{note:noteContent, target:lang})
    .then((response) => {
      console.log("note converted")
      setNoteContent(response.data.note)
    })
    .catch((error) => {
        const data = error.response.data
        if (error.response.status === 400) {
            console.log("something went wrong")
        }
    })
  }
  const handleLanguage = e => { 
    setLang(e.target.value);
    convertNoteLang();
}

  const getDate = (date) => moment(date).format("DD.MM.yyyy");
  const getTime = (date) => moment(date).format("HH.mm");

  return (
    <Card className = "card" variant = "outlined" sx={{ maxWidth: 400, position: "relative", height: "100%" }} fullWidth>
       <CardHeader
        title= {noteTitle}
        action={
                <>
            <IconButton
            onClick={() => speakOnClick()}
            disabled={favoriteButtonDisabled}
            sx={{ color: isLiked ? "red" : "gray" }}
            size="small">
            <RecordVoiceOverIcon/>
            </IconButton>
            <IconButton
            onClick={() => upddateNoteFavorite()}
            disabled={favoriteButtonDisabled}
            sx={{ color: isLiked ? "red" : "gray" }}
            size="small"
          >
             <ShareIcon/>
          </IconButton><IconButton
            onClick={(e) => {
              setMenuOpened(true);
              setAnchor(e.currentTarget);
            } }
          >
              <MoreVert />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchor}
              open={menuOpened}
              onClose={() => setMenuOpened(false)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={() => {
                  setIsEdit(!isEdit);
                  setMenuOpened(false);
                }}
              >
                <Edit sx={{ mr: 2 }} /> Edit
              </MenuItem>
              <MenuItem onClick={() => deleteNoteOnClick()}>
                <Delete sx={{ mr: 2 }} /> Delete
              </MenuItem>
            </Menu>
            </>
        }
      /> 
            
      <CardContent justifyContent="space-between" sx={{ height: "100%" }}>
        {/* {!isEdit ? (
          <Typography
            noWrap
            gutterBottom
            variant="h5"
            component="div"
            sx={{ mr: "300px" }}
          >
            {noteTitle}
          </Typography>
        ) : (
          <TextField
            sx={{ mb: 3 }}
            fullWidth
            variant="outlined"
            label="Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        )} */}
        <Divider className= "divider" light />
        {!isEdit ? (
          <>
            <Grid container flexDirection="column" sx={{ height: "100%" }}>
              <Typography
                variant="body2"
                gutterBottom
                color="text.secondary"
                sx={{
                  minHeight: 350,
                  maxHeight: 350,
                  mb: "40px",
                }}
              >
                {noteContent}
              </Typography>
              <Box sx={{ position: "absolute", bottom: "12px", left: "12px" }}>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "text.disabled" }}
                >
                  {getTime(note.updatedAt)}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ color: "text.disabled" }}
                >
                  {getDate(note.updatedAt)}
                </Typography>
                <select value={lang} onChange={handleLanguage}>
              {languages.map(item => {
                  return (<option key={item.value} 
                  value={item.value}>{item.text}</option>);
              })}
            </select>
              </Box>
            </Grid>
          </>
        ) : (
          <TextField
            sx={{ maxHeight: 350, pt: 2, mt: 4, height: 300}}
            fullWidth
            variant="standard"
            label="Content"
            multiline
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        )}
        {isEdit && (
          <LoadingButton
            sx={{
              mt: 2,
            }}
            fullWidth
            loading={buttonDisabled}
            variant="outlined"
            size="medium"
            onClick={() => editedNote()}
          >
            Save
          </LoadingButton>
        )}
      </CardContent>
    </Card>
  );
}