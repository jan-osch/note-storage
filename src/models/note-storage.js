import Note from "./note";
import _ from "lodash";

export default class NoteStorage {
    constructor() {
        this._sortedByAge = [];
        this._valueSumByTitle = {};
        this._countByTitle = {};
    }

    insertNote(note, callback) {
        if (!(Note.isValid(note))) {
            return callback(new Error("Invalid note"))
        }
        this._insertToSortedByAge(note);
        this._insertToValueSumByTitle(note);
        this._insertToCountByTitle(note);
        this._needSort = true;
        callback();
    }

    getNewestNotes(amount, callback) {
        this._sortByAgeIfNeeded();
        callback(null, this._sortedByAge.slice(0, amount));
    }

    getMostCommonWithCount(amount, callback) {
        const result = {};
        this._getMostCommonTitlesWithCount(amount).forEach((element)=> {
            result[element.title] = element.count;
        });
        callback(null, result);
    }

    getMostCommonWithValuesSum(amount, callback) {
        const result = {};
        this._getMostCommonTitlesWithCount(amount).forEach((element)=> {
            result[element.title] = this._valueSumByTitle[element.title];
        });
        callback(null, result);
    }

    _sortByAgeIfNeeded() {
        if (this._needSort) {
            this._sortedByAge = _.orderBy(this._sortedByAge, ['createdAt', 'title'], ['desc', 'asc']);
            this._needSort = false;
        }
    }

    _insertToSortedByAge(note) {
        return this._sortedByAge.push(note);
    }

    _insertToValueSumByTitle(note) {
        this._insertToSumAggregate(this._valueSumByTitle, note.title, note.value);
    }

    _insertToCountByTitle(note) {
        this._insertToSumAggregate(this._countByTitle, note.title, 1);
    }

    _insertToSumAggregate(aggregate, key, value) {
        if (!aggregate[key]) {
            aggregate[key] = value;
            return;
        }
        aggregate[key] = aggregate[key] + value;
    }

    _getMostCommonTitlesWithCount(amount) {
        if (amount <= 0) {
            return [];
        }
        return this._getSortedTitleCountPairs().slice(-amount);
    }

    _getSortedTitleCountPairs() {
        return _.sortBy(_.map(this._countByTitle, (value, key)=> {
            return {title: key, count: value};
        }), ['count', 'title']);
    }
}