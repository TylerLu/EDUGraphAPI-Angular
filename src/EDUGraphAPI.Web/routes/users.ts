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

router.post('/', function (req, res) {
    var user = req.body;
    userService.creatUser(user.email, user.password, user.firstName, user.lastName, user.favoriteColor)
        .then(user => res.send(201, user))
        .catch(error => res.json(500, { error: error }));
});

router.get('/:userId/unlink', function (req, res) {
    var userId = req.params.userId;
    userService.unlinkUser(userId)
        .then(() => res.end())
        .catch(error => res.json(500, { error: error }));
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



//test code
//import organizationService = require('../services/organizationService');
//router.post('/createOrUpdateOrganization', function (req: express.Request, res: express.Response) {
//    organizationService.createOrUpdateOrganization(req.body.tenantId, req.body.name, req.body.isAdminConsented)
//        .then((org) => {
//            res.json(org)
//        })
//        .catch((err: any) => {
//            res.json(err);
//        });
//});
//router.post('/updateOrganization', function (req: express.Request, res: express.Response) {
//    organizationService.updateOrganization(req.body.tenantId, req.body.isAdminConsented)
//        .then((org) => {
//            res.json(org)
//        })
//        .catch((err: any) => {
//            res.json(err);
//        });
//});

//router.post('/updateLocalUser', function (req: express.Request, res: express.Response) {
//    userService.updateLocalUser(req.body.userId, req.body.o365User, req.body.tenant)
//        .then((ret) => {
//            res.json(ret)
//        })
//        .catch((err: any) => {
//            res.json(err);
//        });
//});

export = router;