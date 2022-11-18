import functions from "firebase-functions";
import express from  "express";
import cors from "cors";
import { getAllPhotos, addNewPhoto, addLike, userLogin } from "./src/photos.js";

const app = express();
app.use(cors());
app.use(express.json())


app.post('/login', userLogin)
app.get('/photos', getAllPhotos);  
app.post('/photos', addNewPhoto);
app.patch('/photos/:photoId',addLike)


export const api = functions.https.onRequest(app);