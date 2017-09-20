/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Login } from './login/login.component';
import { Header } from './header/header.component';
import { Register } from './register/register.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

export const appRoutes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'schools', redirectTo: "schools" },
    { path: 'header', component: Header },
    { path: '**', component: HomeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);