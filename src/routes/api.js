import {Router} from "express";

export default function (noteStorage) {
    var api = Router();

    api.get('/note/most_recent', (req, res) => {
        let count = parseInt(req.query.count);
        count = count || 1;
        noteStorage.getNewestNotes(count, (err, results)=> {
            if (err) {
                return res.sendStatus(500);
            }
            res.json({
                found: results.length,
                results: results
            });
        });
    });

    api.get('/title/most_frequent/sum_values', (req, res) => {
        let count = parseInt(req.query.count);
        count = count || 1;
        noteStorage.getMostCommonWithValuesSum(count, (err, results)=> {
            if (err) {
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });

    api.get('/title/most_frequent/frequency', (req, res) => {
        let count = parseInt(req.query.count);
        count = count || 1;
        noteStorage.getMostCommonWithCount(count, (err, results)=> {
            if (err) {
                return res.sendStatus(500);
            }
            res.json(results);
        });
    });

    return api;
}