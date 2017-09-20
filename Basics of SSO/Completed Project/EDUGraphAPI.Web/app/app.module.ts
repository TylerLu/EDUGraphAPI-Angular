/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { NgModule, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CustomFormsModule } from 'ng2-validation'
import { AppComponent } from './app.component';
import { Login } from './login/login.component';
import { Header } from './header/header.component';

import { routing } from './app.routing';
import { AuthHelper } from "./authHelper/authHelper";
import { UserService } from "./services/userService";
import { MeService } from "./services/meService";
import { JsonProperty, MapUtils } from "./utils/jsonHelper";
import { Register } from './register/register.component';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, CustomFormsModule, routing, HttpModule],
    declarations: [AppComponent, Login, Register, Header,  HomeComponent],
    bootstrap: [AppComponent],
    providers: [
        { provide: 'auth', useClass: AuthHelper },
        { provide: 'me', useClass: MeService },
        { provide: 'user', useClass: UserService }
    ]
})

export class AppModule {
}