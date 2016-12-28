import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';
import { UserService } from '../services/userService';

var router = express.Router();
var userService = new UserService();

var getCurrentUserId = function () {
    var currentUserId = "39080da7-2091-4e82-9954-5d427802aa20";//TODO: theo will give the current userid
    return currentUserId;
}

router.route('/')
    .get(function (req, res) {
        var userId = getCurrentUserId();
        userService.getUserModelById(userId)
            .then(user => res.json(user))
            .catch(error => res.send(500, error));
    })
    .post(function (req, res) {
        var user = req.body;
        userService.updateUser(user)
            .then(() => res.end())
            .catch(error => res.send(500, error));
    });

router.get('/accessToken/:resource', function (req, res) {
    var resource = req.param['resource'] as string;
    userService.getAccessToken(resource)
        .then(token => res.json(token))
        .catch(error => res.send(500, error));
});

export = router;