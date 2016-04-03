/* @flow */

import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import api from "./routes/api";
import NoteStorage from "./models/note-storage";
import NoteGenerator from "./models/note-generator";

const app = express();
const noteStorage = new NoteStorage();
const noteGenerator = new NoteGenerator(noteStorage);
const notesAmount = 100000;

console.log('Starting to populate storage with notes');
noteGenerator.generateMultipleNotes(notesAmount, ()=> {
    console.log(`${notesAmount} notes inserted to storage`);
});

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api', api(noteStorage));

app.listen(3000, ()=> {
    console.log('Server is listening');
});

export default app;
