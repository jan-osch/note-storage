import _ from "lodash";
import Note from "./note";
import moment from "moment";
export default class NoteGenerator {

    constructor(noteStorage) {
        this._noteStorage = noteStorage;
        this._alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    }

    generateNote() {
        return new Note(this._generateRandomNoteValue(), this._generateRandomTitle(), moment())
    }

    insertNoteToStorage(callback) {
        this._noteStorage.insertNote(this.generateNote(), callback);
    }

    generateMultipleNotes(number, callback) {
        let current = 0;
        while (current < number) {
            this._noteStorage.insertNote(this.generateNote(), ()=> {
            });
            if(++current % 10000 === 0){
                console.log(`inserted ${current} notes`);
            }
        }
        callback();
    }

    _generateRandomNoteValue() {
        return _.random(Note.valueLowerLimit, Note.valueUpperLimit, true);
    }

    _generateRandomTitle() {
        return _.sample(this._alphabet);
    }
}