import express = require('express');
import * as Sequelize from 'sequelize';
import * as Storage from '../data/dbContext';
import * as Promise from "bluebird";

var router = express.Router();
var dbContext = new Storage.DbContext();

// POST http://localhost:8080/schools/SaveSeatingArrangements
router.post('/SaveSeatingArrangements', function (req: express.Request, res: express.Response) {
    fetchUserSeats(req.body).then((result: any) => {
        res.json('');
    });
});

function fetchUserSeats(arr: Array<any>): Promise<any> {

    return arr.reduce((previous, current, index, array) => {
        return previous
            .then(() => { return fetchSeat(array[index]) })
    }, Promise.resolve());
}

let fetchSeat = (item) => {
    return new Promise((resolve, reject) => {
        dbContext.ClassroomSeatingArrangement
            .findOne({ where: { o365UserId: item.o365UserId, classId: item.classId } })
            .then(seat => {
                if (item.position != 0) {
                    //insert
                    if (seat == null) {
                        dbContext.ClassroomSeatingArrangement
                            .create(item)
                            .then((tt) => {
                                resolve(true);
                            })
                    }
                    else {
                        //update
                        seat.position = item.position;
                        seat.save()
                            .then((tt) => {
                                resolve(true);
                            });
                    }
                }
                else {
                    //delete
                    if (seat != null) {
                        seat.destroy()
                            .then(() => {
                                resolve(true);
                            });
                    }
                }
            })
            .catch((erro: any) => {
                resolve(true);
            })
    })
}

export = router;