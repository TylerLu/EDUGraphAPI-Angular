/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { Constants } from './constants'
import * as auth from './authenticationHelper'

export class UserDataSyncService {

    syncAsync(): Promise<any> {
        // TODO: get consented tetant ids.
        var organizationIds = [
            '64446b5c-6d85-4d16-9ff2-94eddc0c2439',
            '64446b5c-6d85-4d16-9ff2-94eddc0c2439'];
        return Promise.all(organizationIds.map(this.syncOrganizationAsync));
    }

    private syncOrganizationAsync(organizationId: string): Promise<any> {
        return auth.getAppOnlyAccessTokenAsync(organizationId, Constants.ClientId, Constants.MSGraphResource)
            .then(tokenResponse => {
                var accessToken = tokenResponse['accessToken'];
                // TODO: get changed data and update users in db.
                console.log(accessToken);
            });
    }
}