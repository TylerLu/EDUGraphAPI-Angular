import express = require('express');
import * as Storage from '../data/dbContext';
import * as Sequelize from 'sequelize';
import { Constants } from '../constants';
import { UserService } from '../services/userService';
import { TokenCacheService } from '../services/tokenCacheService';

var router = express.Router();
var userService = new UserService();


router.route('/')
    .get(function (req, res) {
        var u = req.user;
        if (u.authType == 'O365') {
            var retUser;
            userService.getUserModel({ o365UserId: u.oid })
                .then(user => {
                    if (user == null) {
                        return userService.getO365User(u.oid, u._json.tid)
                            .then(user => {
                                user.areAccountsLinked = false;
                                user.authType = u.authType;
                                retUser = user;
                                return userService.validUserHasSameEmail(retUser.o365Email);
                            })
                            .then((ret) => {
                                retUser.hasSameNameLocalAccount = ret;
                                return retUser;
                            })
                    }
                    else {
                        user.areAccountsLinked = true;
                        user.authType = u.authType;
                        return user;
                    }
                })
                .then(usermodel => { res.json(usermodel); })
                .catch(error => {
                    res.json(500, { error: error })
                });
        }
        else {
            userService.getUserModel({ id: u.id })
                .then(user => {
                    user.areAccountsLinked =
                        user.o365UserId != null && user.o365UserId != ''
                        && user.o365Email != null && user.o365Email != '';
                    res.json(user);
                })
                .catch(error => res.json(500, { error: error }));
        }

    })
router.post('/favoriteColor', function (req, res) {
    var user = req.body;
    userService.updateFavoriteColor(user.id, user.favoriteColor)
        .then((user) => {
            res.json(user);
        })
        .catch(error => res.json(500, { error: error }));
});


router.get('/accesstoken', function (req, res) {
    if (req.isAuthenticated()) {
        let oid = req.user.oid;
        var tokenCache = new TokenCacheService();
        switch (req.query["resource"]) {
            case Constants.MSGraphResource:
                tokenCache.getMSAccessToken(oid)
                    .then((result) => {
                        res.json(result);
                    })
                    .catch(error => res.json(500, { error: error }));
                break;
            case Constants.AADGraphResource:
                tokenCache.getAADAccessToken(oid)
                    .then((result) => {
                        res.json(result);
                    })
                    .catch(error => res.json(500, { error: error }));
                break;
            default:
                res.json({ error: "resource is invalid" });
                break;
        }
    }
    else {
        res.json({ error: "401 unauthorized" });
    }
});

export = router;