/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Routes, RouterModule } from '@angular/router';
import { SchoolComponent } from './school.component'


const routes: Routes = [
    {
        path: 'schools',
        component: SchoolComponent
    }
];

export const routing = RouterModule.forChild(routes);