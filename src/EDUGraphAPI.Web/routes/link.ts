import express = require('express');
import * as request from 'superagent';
import jwt = require('jsonwebtoken');
var router = express.Router();

import { UserService } from '../services/userService';
import { Constants } from '../constants';


var userService = new UserService();

router.post('/ExistingLocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkExistingLocalUser(u, localUser.email, localUser.password)
            .then(() => {
                res.json(200);
            })
            .catch(error => {
                res.json(500, { error: error })
            })

    }
    else {
        res.json(500, { error: "Invalid login attempt." });
    }
});

router.post('/CreateLocalUser', function (req, res) {
    var u = req.user;
    if (u.authType == 'O365') {
        var localUser = req.body;
        userService.linkCreateLocalUser(u, localUser.email, localUser.password, localUser.favoriteColor)
            .then(() => {
                res.json(200);
            })
            .catch(error => res.json(500, { error: error }))

    }
    else {
        res.json(500, { error: "Invalid login attempt." });
    }
});

router.post('/O365User', function (req, res) {
    var redirectUrl = req.query.redirectUrl || '/schools';
    var localUser = req.user;
    var idToken = jwt.decode(req.body.id_token);
    var tentantId = idToken.tid;
    var code = req.body.code;
    getAccessToken(code, tentantId, Constants.MSGraphResource)
        .then(accessToken => {
            return userService.linkO365User(accessToken, localUser.id, tentantId)
        })
        .then(() => {
            res.redirect(redirectUrl);
        })
        .catch(error => {
            let errorMsg: String = '';
            if (typeof error == 'string' || error instanceof String) {
                errorMsg = error;
            }
            else if (error != null && error.hasOwnProperty('message')) {
                errorMsg = error.message
            }
            else {
                errorMsg = 'unknown error'
            }
            res.redirect('/link?error=' + encodeURI(errorMsg as string));
        });
})


function getAccessToken(code: string, tenantId: string, resource: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        var url = 'https://login.microsoftonline.com/' + tenantId + '/oauth2/token';
        var redirectUri = `https://${Constants.Host}/api/link/O365User`
        request.post(url)
            .accept('application/json')
            .send('resource=' + encodeURI(resource))
            .send('client_id=' + Constants.ClientId)
            .send('client_secret=' + Constants.ClientSecret)
            .send('grant_type=authorization_code')
            .send('code=' + code)
            .send('redirect_uri=' + encodeURI(redirectUri))
            .end((err, res) => {
                if (err != null) reject(err);
                else resolve(res.body.access_token);
            });
    });
}

export = router;