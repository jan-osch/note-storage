import Note from "../../models/note";
import moment from "moment";

describe('Note', ()=> {
    it('exports are defined properly, module can be parsed', ()=> {
        expect(Note).toBeDefined();
    });

    it('new instance can be created', ()=> {
        const note = new Note(1.0, 'a', moment());
        expect(note).toBeTruthy();
    });

    it('accessors work as expected', ()=> {
        const created = moment();
        const note = new Note(1.0, 'a', created);
        expect(note.value).toEqual(1.0);
        expect(note.title).toEqual('a');
        expect(note.createdAt).toEqual(created);
    });

    describe('compare', ()=> {
        it('returns result of comparison by createdAt #1', ()=> {
            const secondCreated = moment();
            const firstCreated = moment(secondCreated).subtract(1, 'days');
            const first = new Note(1.0, 'a', firstCreated);
            const second = new Note(1.0, 'a', secondCreated);
            expect(Note.compare(first, second)).toEqual(-1);
        });

        it('returns result of comparison by createdAt #2', ()=> {
            const secondCreated = moment();
            const firstCreated = moment(secondCreated).add(1, 'days');
            const first = new Note(1.0, 'a', firstCreated);
            const second = new Note(1.0, 'a', secondCreated);
            expect(Note.compare(first, second)).toEqual(1);
        });

        it('returns result of comparison by title if createdAt matches #1', ()=> {
            const date = moment();
            const first = new Note(1.0, 'a', date);
            const second = new Note(1.0, 'b', date);
            expect(Note.compare(first, second)).toEqual(-1);
        });

        it('returns result of comparison by title if createdAt matches #2', ()=> {
            const date = moment();
            const first = new Note(1.0, 'a', date);
            const second = new Note(1.0, 'b', date);
            expect(Note.compare(first, second)).toEqual(-1);
        });

        it('returns result of comparison by value if createdAt and title match #1', ()=> {
            const date = moment();
            const first = new Note(1.0, 'a', date);
            const second = new Note(2.0, 'a', date);
            expect(Note.compare(first, second)).toEqual(-1);
        });

        it('returns result of comparison by value if createdAt and title match #2', ()=> {
            const date = moment();
            const first = new Note(3.0, 'a', date);
            const second = new Note(1.0, 'a', date);
            expect(Note.compare(first, second)).toEqual(1);
        });

        it('returns 0 if createdAt, title and value match', ()=> {
            const date = moment();
            const first = new Note(1.0, 'a', date);
            const second = new Note(1.0, 'a', date);
            expect(Note.compare(first, second)).toEqual(0);
        });
    });

    describe('isValid', ()=> {
        it('will return false when note title is not a string', ()=> {
            const actual = Note.isValid({title: 1, value: 1.0, createdAt: moment()});
            expect(actual).toBeFalsy();
        });
        it('will return false when note value is not number', ()=> {
            const actual = Note.isValid({title: 'a', value: '1.0', createdAt: moment()});
            expect(actual).toBeFalsy();
        });
        it('will return false when note value is bigger than upper limit', ()=> {
            const actual = Note.isValid({title: 'a', value: Note.valueUpperLimit + 1, createdAt: moment()});
            expect(actual).toBeFalsy();
        });
        it('will return false when note value is smaller than lower limit', ()=> {
            const actual = Note.isValid({title: 'a', value: Note.valueLowerLimit - 1, createdAt: moment()});
            expect(actual).toBeFalsy();
        });
        it('will return false when date is not valid', ()=> {
            const actual = Note.isValid({title: 'a', value: Note.valueLowerLimit + 1, createdAt: 'wrong'});
            expect(actual).toBeFalsy();
        });
        it('will return true for valid note parameters', ()=> {
            const actual = Note.isValid({title: 'a', value: Note.valueLowerLimit + 1, createdAt: moment()});
            expect(actual).toBeTruthy();
        });
    });
});
