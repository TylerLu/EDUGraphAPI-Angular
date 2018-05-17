/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
var Sequelize = require('sequelize');
var sequelize = require('./db');

var DataSyncRecorders = sequelize.define('DataSyncRecords', {

        tenantId: Sequelize.STRING,
        query: Sequelize.STRING,
        deltaLink: Sequelize.STRING,
    },
    {
        timestamps: false,
        tableName: "DataSyncRecords"
    });




exports.getOrCreateDataSyncRecorder = function (tenantId) {
    return DataSyncRecorders.findOne({ where: { TenantId: tenantId } })
        .then(dataSyncRecorder => {
            if (dataSyncRecorder == null) {
                var url = 'https://graph.microsoft.com/v1.0/users/delta?$select=jobTitle,department,mobilePhone';                
                return DataSyncRecorders.create({
                    tenantId: tenantId,
                    query: 'users',
                    deltaLink:url
                });
            }
            else {
                return dataSyncRecorder;
            }
        });
};
