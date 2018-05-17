/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { Constants } from './constants'
import * as auth from './authenticationHelper'

var organization = require('./db/organization');
var dataSyncRecorder = require('./db/dataSyncRecorder');

export class UserDataSyncService {

    syncAsync(): Promise<any> {

        return organization.getAllConsentedTenants()
            .then(function (orgs) {        
                var organizationIds = [];
                for (let org of orgs) {
                    organizationIds.push(org.tenantId);
                }
                return organizationIds;
            }).then(function (organizationIds) {
                return Promise.all(organizationIds.map(function (id) {                   
                    new UserDataSyncService().syncOrganizationAsync(id);
                }));                
            });      
       
        
    }

    private syncOrganizationAsync(tenantId: string): Promise<any> {
        return dataSyncRecorder.getOrCreateDataSyncRecorder(tenantId).then(recorder => {
            return recorder.deltaLink;
        }).then(deltaLink => {
            return auth.getAppOnlyAccessTokenAsync(tenantId, Constants.ClientId, Constants.MSGraphResource)
                .then(tokenResponse => {
                    return tokenResponse['accessToken'];
                }).then(token => {
                    console.log(token);
                    console.log(deltaLink);
                    console.log(tenantId);
                    return null;
                });
         });

        //return auth.getAppOnlyAccessTokenAsync(tenantId, Constants.ClientId, Constants.MSGraphResource)
        //    .then(tokenResponse => {
        //        return tokenResponse['accessToken'];
        //    }).then(token => {
        //        //var syncRecorder = dataSyncRecorder.getOrCreateDataSyncRecorder
        //        return null;
        //    });
    }
}