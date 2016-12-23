import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Login } from './login/login.component';
import { Prod } from './prod/prod.component';

const appRoutes: Routes = [   
    {
        path: 'prod',
        component: Prod
    },

    {
        path: '**',  // otherwise route.
        component: Login
    }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);