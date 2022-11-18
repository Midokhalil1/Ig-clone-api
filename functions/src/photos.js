import { FieldValue } from "firebase-admin/firestore";
import jwt from 'jsonwebtoken'
import dbConnect from "./dbConnect.js";
import {secretKey} from "../secrets.js";

export async function getAllPhotos(req, res) {

    const db = dbConnect();
   const collection = await db.collection('photos').get()
   .catch(err => res.status(500).send(err));

   const photos = collection.docs.map(doc => ({...doc.data(), photoId: doc.id}));
   res.send(photos)



}

export async function addNewPhoto(req, res){
    const newPhoto = req.body;
    const db = dbConnect();
    await db.collection('photos').add(newPhoto)
    .catch(err => res.status(500).send(err));
    getAllPhotos(req, res);

}

export async function addLike(req, res) {
    const {photoId} = req.params;
    const db = dbConnect();
    await db.collection('photos').doc(photoId)
    .update({likes: FieldValue.increment(1)})
    .catch(err => res.status(500).send(err))
    getAllPhotos(req, res);

}

export  async function userLogin(req, res){
    const { email, password} = req.body
    const db = dbConnect()
    const matchingUsers = await db.collection('users')
    .where('email', '==', email.toLowerCase())
    .where('password', '==', password)
    .get()
const users = matchingUsers.docs.map(doc => ({...doc.data(), uid: doc.id}))
if(!users.length){
    res.status(401).send({message: 'Invalid email or password'})
    return
}
// if we get here...we have (at least) one matching user
let user = users[0]
user.password = undefined

const token = jwt.sign(user, secretKey)
res.send({user, token })
}