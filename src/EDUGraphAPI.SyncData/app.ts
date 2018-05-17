/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { UserDataSyncService } from './userDataSyncService'

var userDataSyncService = new UserDataSyncService();
userDataSyncService.syncAsync()
    .then(() => { console.log('Done!') });
    