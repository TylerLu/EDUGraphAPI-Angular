/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Routes, RouterModule } from '@angular/router';
import { Link } from './link.component';
import { LinkCreateLocal } from './link.createLocal.component';
import { LinkLoginLocal } from './link.loginLocal.component';
import { LinkLoginO365Requried } from './link.loginO365Required.component';

const routes: Routes = [
    {
        path: 'link',
        component: Link
    },
    {
        path: 'link-local',
        component: LinkCreateLocal
    },
    {
        path: 'link-loginLocal',
        component: LinkLoginLocal
    },
    {
        path: 'link-loginO365Requried',
        component: LinkLoginO365Requried
    }
];

export const routing = RouterModule.forChild(routes);

