﻿/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Constants } from '../constants';
var Sequelize = require('sequelize');


module.exports = new Sequelize(Constants.MySQLDbName, Constants.MySQLUser, Constants.MySQLPassword, {
    host: Constants.MySQLHost,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 1000000,
        maxIdleTime: 1000000
    }
});