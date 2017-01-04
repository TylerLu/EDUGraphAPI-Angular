﻿import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';
import { UserService } from '../services/userService';

var router = express.Router();
var userService = new UserService();

router.post('/', function (req, res) {
    var user = req.body;
    userService.creatUser(user.email, user.password, user.firstName, user.lastName, user.favoriteColor)
        .then(user => res.send(201, user))
        .catch(error => res.json(500, { error: error }));
});

export = router;