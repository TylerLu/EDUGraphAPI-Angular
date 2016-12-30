import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';
import { UserService } from '../services/userService';

var router = express.Router();
var userService = new UserService();


router.route('/')
    .get(function (req, res) {
        var u = req.user;
        if (u.authType == 'O365') {
            userService.getUserModel({ o365UserId: u.oid })
                .then(user => {
                    if (user == null) {
                        user = {
                            firstName: u.name.givenName,
                            lastName: u.name.familyName,
                            o365UserId: u.oid,
                            o365email: u.upn
                        };
                    }
                    user.authType = u.authType;
                    res.json(user);
                })
                .catch(error => res.json(500, { error: error }));
        }
        else {
            var userId = '39080da7-2091-4e82-9954-5d427802aa20';
            userService.getUserModel({ id: userId })
                .then(user => res.json(user))
                .catch(error => res.json(500, { error: error }));
        }

    })
    .post(function (req, res) {
        var user = req.body;
        var userId = '39080da7-2091-4e82-9954-5d427802aa20'; //TODO: Tyler get current user id
        userService.updateUser(userId, user)
            .then(() => res.end())
            .catch(error => res.json(500, { error: error }));
    });

router.get('/accessToken/:resource', function (req, res) {
    var resource = req.param['resource'] as string;
    userService.getAccessToken(resource)
        .then(token => res.json(token))
        .catch(error => res.json(500, { error: error }));
});

export = router;