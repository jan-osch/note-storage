import NoteStorage from "../../models/note-storage";
import Note from "../../models/note";
import moment from "moment";
import _ from "lodash";

describe('NoteStorage', ()=> {
    it('exports are defined properly, module can be parsed', ()=> {
        expect(NoteStorage).toBeDefined();
    });
    it('can be instantiated', ()=> {
        const noteStorage = new NoteStorage();
        expect(noteStorage).toBeDefined();
    });
    describe('insertNote', ()=> {
        let noteStorage;
        const mockCallback = jasmine.createSpy('callback', []);

        beforeEach(()=> {
            noteStorage = new NoteStorage();
            spyOn(Note, 'compare').andCallFake((a, b)=> {
                if (a.createdAt < b.createdAt) {
                    return -1;
                } else if (a.createdAt > b.createdAt) {
                    return 1;
                }
                return 0;
            });
            spyOn(Note, 'isValid').andReturn(true);
        });

        it('if note is not a valid Note it will return error', ()=> {
            Note.isValid.andReturn(false);

            noteStorage.insertNote({}, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(jasmine.any(Error));
        });

        it('will add one note to _sortedByAge', ()=> {
            const mockNote = {value: 1.0, title: 'a', createdAt: new Date()};
            noteStorage.insertNote(mockNote, mockCallback);
            expect(noteStorage._sortedByAge).toEqual([mockNote]);
            expect(mockCallback).toHaveBeenCalled();
        });

        it('will multiple values to _sortedByAge', ()=> {
            const input = [
                {value: 1.0, title: 'a', createdAt: 2},
                {value: 1.0, title: 'a', createdAt: 3},
                {value: 1.0, title: 'a', createdAt: 4},
                {value: 1.0, title: 'a', createdAt: 1},
                {value: 1.0, title: 'b', createdAt: 4}
            ];
            noteStorage.insertNote(input[0], mockCallback);
            noteStorage.insertNote(input[1], mockCallback);
            noteStorage.insertNote(input[2], mockCallback);
            noteStorage.insertNote(input[3], mockCallback);
            noteStorage.insertNote(input[4], mockCallback);

            expect(noteStorage._sortedByAge.length).toEqual(5);
        });

        it('will update value aggregate by title', ()=> {
            noteStorage.insertNote({value: 1.0, title: 'a', createdAt: moment()}, mockCallback);

            expect(noteStorage._valueSumByTitle).toBeDefined();
            expect(noteStorage._valueSumByTitle['a']).toEqual(1.0);
        });

        it('will update value aggregate by title, for multiple notes', ()=> {
            noteStorage.insertNote({value: 1.0, title: 'a', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 2.0, title: 'a', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 7.4, title: 'a', createdAt: moment()}, mockCallback);

            expect(noteStorage._valueSumByTitle['a']).toEqual(10.4);
        });

        it('will update count aggregate by title, for multiple notes', ()=> {
            noteStorage.insertNote({value: 1.0, title: 'a', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 2.0, title: 'a', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 7.4, title: 'a', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 7.4, title: 'b', createdAt: moment()}, mockCallback);
            noteStorage.insertNote({value: 7.4, title: 'b', createdAt: moment()}, mockCallback);

            expect(noteStorage._countByTitle['a']).toEqual(3);
            expect(noteStorage._countByTitle['b']).toEqual(2);
        });
    });
    describe('getMostCommonWithCount', ()=> {
        let noteStorage;
        let mockCallback = jasmine.createSpy('callback');

        beforeEach(()=> {
            noteStorage = new NoteStorage();
        });

        it('will return an array of n most common titles with count sorted ascending by count', ()=> {
            noteStorage._countByTitle = {
                'a': 13,
                'b': 10,
                'c': 22,
                'd': 1
            };

            const expected = {'a': 13, 'c': 22};
            noteStorage.getMostCommonWithCount(2, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, expected);
        });
        it('if titles have the same count, they will be sorted alphabetically', ()=> {
            noteStorage._countByTitle = {
                'b': 22,
                'd': 22,
                'c': 22,
                'a': 22
            };
            const expected = {
                'c': 22, 'd': 22
            };
            noteStorage.getMostCommonWithCount(2, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, expected);
        });
        it('for zero amount it will return an empty object', ()=> {
            noteStorage._countByTitle = {
                'b': 22,
                'd': 22,
                'c': 22,
                'a': 22
            };
            noteStorage.getMostCommonWithCount(0, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, {});
        });
        it('for amount bigger than actual data size will return whole data set', ()=> {
            noteStorage._countByTitle = {
                'b': 22,
                'd': 22,
                'c': 22,
                'a': 22
            };
            noteStorage.getMostCommonWithCount(10, mockCallback);

            expect(_.toPairs(mockCallback.mostRecentCall.args[1]).length).toEqual(4);
        });
    });
    describe('getMostCommonWithValuesSum', ()=> {
        let noteStorage;
        let mockCallback = jasmine.createSpy('callback');

        beforeEach(()=> {
            noteStorage = new NoteStorage();
        });

        it('will return an empty object if no data is stored', ()=> {
            noteStorage.getMostCommonWithValuesSum(1, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, {});
        });

        it('will sum of values for n most common titles', ()=> {
            noteStorage._countByTitle = {
                'a': 100,
                'b': 200,
                'c': 140,
                'd': 7
            };
            noteStorage._valueSumByTitle = {
                'a': 33335,
                'b': 1123.2,
                'c': 9999,
                'd': 800000
            };
            const expected = {'c': 9999, 'b': 1123.2};
            noteStorage.getMostCommonWithValuesSum(2, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, expected);
        });
    });

    describe('getNewestNotes', ()=> {
        let noteStorage;
        let mockCallback = jasmine.createSpy('callback');

        const insertMultiple = (arrayOfNotes) => {
            arrayOfNotes.forEach((element)=> {
                noteStorage.insertNote(element, ()=> {
                });
            });
        };

        beforeEach(()=> {
            noteStorage = new NoteStorage();
            spyOn(Note, 'isValid').andReturn(true);
            spyOn(Note, 'compare').andCallFake((a, b)=> {
                if (a.createdAt < b.createdAt) {
                    return -1;
                } else if (a.createdAt > b.createdAt) {
                    return 1;
                }
                return 0;
            });
        });

        it('will return an empty array if no data is stored', ()=> {
            noteStorage.getNewestNotes(1, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, []);
        });

        it('will return an array of n most recently added notes in descending order by createdAt', ()=> {
            const a = {value: 1.0, title: 'a', createdAt: 2};
            const b = {value: 1.0, title: 'b', createdAt: 3};
            const c = {value: 1.0, title: 'c', createdAt: 4};
            const d = {value: 1.0, title: 'd', createdAt: 1};
            const e = {value: 1.0, title: 'e', createdAt: 6};
            insertMultiple([a, b, c, d, e]);


            noteStorage.getNewestNotes(2, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(null, [e, c])
        });
    });
});