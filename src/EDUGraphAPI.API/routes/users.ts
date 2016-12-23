import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';


var router = express.Router();
var dbContext = new Storage.DbContext();
import userService = require('../services/userService');


router.get('/', function (req, res, next) {

    dbContext.User.all()
        .then(users => {
            res.json(users);
        });
});

router.get('/:id', function (req, res) {
    var id = req.params.id;
    dbContext.User.findById(id)
        .then(user => {
            res.json(user);
        });
});


// POST http://localhost:8080/users/register
router.post('/register', function (req: express.Request, res: express.Response) {
    userService.creatUser(req.body.email, req.body.password, req.body.favoriteColor)
        .then((account) => {
            res.json(account)
        })
        .catch((err: any) => {
            res.json(err);
        });
});


//router.post('/validUser', function (req: express.Request, res: express.Response) {
//    userService.validUserPromise(req.body.email, req.body.password)
//        .then((account) => {
//            res.json(account)
//        })
//        .catch((err: any) => {
//            res.json(err);
//        });
//});


// POST http://localhost:8080/users/update
router.post('/update', function (req: express.Request, res: express.Response) {

    dbContext.sequelize.transaction((transaction: Sequelize.Transaction) => {
        return dbContext.User
            .update({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: req.body.passwordHash,
                salt: req.body.salt
            }, { transaction: transaction, where: { id: req.body.id }})
    }).
        then((users) => {
        return res.json(users)
        }).
        catch((err: any) => {
            return res.sendStatus(500);
        })
});
export = router;