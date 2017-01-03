import express = require('express');
var router = express.Router();

import { UserService } from '../services/userService';


var userService = new UserService();

router.post('/ExstingLocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkExstingLocalUser(u, localUser.email, localUser.password)
            .then(() => {
                res.json(200);
            })
            .catch(error => res.json(500, { error: error }))

    }
    else {
        res.json(500, { error: "Wrong TBD!!" });
    }
});

router.post('/CreateLocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkCreateLocalUser(u, localUser.email, localUser.password)
            .then(() => {
                res.json(200);
            })
            .catch(error => res.json(500, { error: error }))

    }
    else {
        res.json(500, { error: "Wrong TBD!!" });
    }
});


router.post('/O365User', function (req, res) {
    var redirectUrl = req.query.redirectUrl || '/schools';
    var authCode = req.body.code
    var u = req.user;

    // TODO: Cloris - Get access token by the authentication code

    // TODO: Cloris - Get o365 user info with and access token and link user accounts

    // TODO: Cloris - Log in the O365 user

    res.redirect(redirectUrl);
})

export = router;