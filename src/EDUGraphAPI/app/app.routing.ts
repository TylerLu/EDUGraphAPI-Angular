import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { Demo } from './demo/demo.component';
import { Register } from './register/register.component';


export const appRoutes: Routes = [
    { path: 'login', component: Login },
    { path: 'register',component: Register},
    { path: 'schools', redirectTo: "schools" },
    { path: 'admin', redirectTo: "admin" },
    { path: 'header', component:  Header},
    { path: 'demo', component: Demo},
    {
        path: '',  // otherwise route.
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);