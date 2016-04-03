export default class Note {
    constructor(value, title, createdAt) {
        this._value = value;
        this._title = title;
        this._createdAt = createdAt;
    }

    static get valueLowerLimit() {
        return 1;
    }

    static get valueUpperLimit() {
        return 4096;
    }

    get value() {
        return this._value;
    }

    get title() {
        return this._title;
    }

    get createdAt() {
        return this._createdAt;
    }

    toString() {
        return `${this._value} ${this._title} ${this._createdAt}`;
    }

    static compare(first, second) {
        let comparisonByAge = Note._compareByKey(first, second, 'createdAt');
        if (Note._isEqual(comparisonByAge)) {
            let comparisonByTitle = Note._compareByKey(first, second, 'title');
            if (Note._isEqual(comparisonByTitle)) {
                return Note._compareByKey(first, second, 'value');
            }
            return comparisonByTitle;
        }
        return comparisonByAge;
    }

    static _compareByKey(first, second, key) {
        if (first[key] < second[key]) {
            return -1;
        }
        if (first[key] == second[key]) {
            return 0;
        }
        return 1;
    }

    static isValid(suspectNote) {
        return ((typeof (suspectNote.title) === 'string')
        && (Note._isValueValid(suspectNote.value))
        && (suspectNote.createdAt.isValid && suspectNote.createdAt.isValid()));
    }

    static _isValueValid(value) {
        return ((typeof (value) === 'number')
        && (Note.valueLowerLimit <= value)
        && ( Note.valueUpperLimit >= value))
    }

    static _isEqual(comparison) {
        return comparison === 0;
    }

    toJSON() {
        return {title: this._title, created_at: this._createdAt, value: this._value}
    }
}

