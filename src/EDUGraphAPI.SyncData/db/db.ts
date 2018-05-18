/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { Constants } from '../constants';
import * as Sequelize from 'sequelize';
import * as fs from 'fs';

var dialectOptions = {};
if(Constants.MySQLSSLCA){
    var caPem = fs.readFileSync(Constants.MySQLSSLCA);
    dialectOptions['ssl'] = {
        ca: caPem
    }
}

module.exports = new Sequelize(Constants.MySQLDbName, Constants.MySQLUser, Constants.MySQLPassword, {
    host: Constants.MySQLHost,
    dialect: 'mysql',
    dialectOptions: dialectOptions,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        maxIdleTime: 10000
    }
});