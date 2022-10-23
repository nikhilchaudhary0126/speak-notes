import axios from "axios";
import { v1 as uuid } from "uuid";
const customAxios = axios.create({
  baseURL: "https://notes-demo-backend.herokuapp.com",
});
customAxios.interceptors.request.use((config) => {
  config.headers["authcookie"] = getAuthToken() || "";

  return config;
});

customAxios.interceptors.response.use((config) => {
  if (config.status === 401) {
    clearAuthToken();
  }
  return config;
});

export const clearAuthToken = () => localStorage.clear();
export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (value) => localStorage.setItem("token", value);
export const HOST = "http://127.0.0.1:5000";
export const login = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return customAxios.post("/login", data);
};

export const register = (username, password) => {
  const data = {
    username: username,
    password: password,
  };
  return customAxios.post("/register", data);
};

export const getMyNotes = (uid) => {
  console.log(uid)
  console.log(`${HOST}/get_notes/${uid}`)
  return customAxios.get(`${HOST}/get_notes/${uid}`);
};

export const addNotes = (userId, title, content) => {
  const data = {
    uid: userId,
    title: title,
    note: content,
  };
  return customAxios.post(`${HOST}/notes`, data);
};

export const deleteNote = (id) => {
  return customAxios.delete(`/notes/${id}`);
};

export const editNote = (noteId, data) => {
  return customAxios.put(`/notes/${noteId}`, data);
};

export const updateFavorited = (noteId, bool) => {
  const data = {
    favorited: bool,
  };
  return customAxios.put(`/notes/favorite/${noteId}`, data);
};

export const logOut = () => {
  return fetch("https://notes-demo-backend.herokuapp.com/logout", {
    method: "POST",
    mode: "cors",
  });
};
// POST  https://notes-demo-backend.herokuapp.com/notes
// obje olarak title ve content yollanacak