/*
 * Local account authentication.
 */

import express = require('express');
import * as Promise from "bluebird";
var router: any = express.Router();
import { UserService } from '../services/userService';

var userSrv = new UserService();

router.post('/account/login', function (req: express.Request, res: express.Response) {
    const email: string = req.body.Email,
        password: string = req.body.Password;

    return new Promise<any>((resolve, reject) => {
        let userSrv = new UserService();
        userSrv.validUser(email, password)
            .then((user: any): void => {
                if (user != null) {
                    resolve(() => {
                        res.cookie('authType', 'Local');
                        res.redirect('/');
                    });
                }
                else {
                    reject((error) => {
                        res.send(401, 'Unautherized');
                    });
                }
            })
            .catch(reject);
    });
});

export = router;