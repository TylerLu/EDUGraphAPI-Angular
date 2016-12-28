/*
 * Local account authentication.
 */

interface ILocalAccountAuthResult {
    status: string;
    authorizationCode?: string;
    accessToken?: string;
}

import express = require('express');
import cache = require('memory-cache');
import authenticateSrv = require('../services/authenticateService');
import * as Promise from "bluebird";
var router: any = express.Router();
import { UserService } from '../services/userService';

var userSrv = new UserService();

router.post('/authenticate/:action', function (req: express.Request, res: express.Response) {
    const email: string = req.body.Email,
        password: string = req.body.Password,
        authorizationCode: string = req.body.authorizationCode,
        action: string = req.params.action;

    switch (action.toLowerCase()) {
        case "signin":
            signIn(email, password).then((result: ILocalAccountAuthResult) => {
                res.json(result);
            });
            break;
        case "signout":
            res.json(signOut(authorizationCode));
            break;
        default:
            res.json({ status: 'fail' });
            break;
    }
});

/*  sign in . */
function signIn(email: string, password: string): Promise<ILocalAccountAuthResult> {
    return userSrv.validUser(email, password)
        .then((user: any): ILocalAccountAuthResult => {
            let result: ILocalAccountAuthResult = null;
            if (user) {
                cache.put(user.Id, true);

                //Get access token 
                //TO DO
                result = { status: "success", authorizationCode: authenticateSrv.GetAuthorizationCode(user.Id), accessToken: '' };
            }
            else {
                result = { status: "fail" };
            }
            return result;
        }).then((result: ILocalAccountAuthResult) => {
            return new Promise<ILocalAccountAuthResult>((resolve, reject) => { resolve(result)});
        });
}

/*  sign out . */
function signOut(authorizationCode: string): any{
    const userId: string = authenticateSrv.GetUserId(authorizationCode);
    if (cache.get(userId) != null) {
        cache.del(userId);
        return { status: "success" };
    }
    else {
        return { status: "fail" };
    }
}

export = router;