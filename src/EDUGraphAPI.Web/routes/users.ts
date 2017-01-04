import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';
import { UserService } from '../services/userService';

var router = express.Router();
var userService = new UserService();

router.get('/linked', function (req, res, next) {
    userService.getLinkedUsers()
        .then(users => res.json(users))
        .catch(error => res.json(500, { error: error }));
});

router.post('/:userId/unlink', function (req, res) {
    var userId = req.params.userId;
    userService.unlinkUser(userId)
        .then(() => res.end())
        .catch(error => res.json(500, { error: error }));
});
export = router;