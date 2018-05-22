/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import { UserDataSyncService } from './userDataSyncService'
import { DbContext } from './dbContext'

var dbContext = new DbContext();
var userDataSyncService = new UserDataSyncService(dbContext);
userDataSyncService.syncAsync()
    .then(() => dbContext.close());
    