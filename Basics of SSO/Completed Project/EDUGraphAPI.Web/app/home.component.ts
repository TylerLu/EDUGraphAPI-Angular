﻿/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';
import { AuthHelper } from "./authHelper/authHelper";
import { MeService } from "./services/meService";
import { Constants } from './constants';

@Component({
    moduleId: module.id,
    template: ''
})

export class HomeComponent implements OnInit {

    constructor(
        private router: Router,
        @Inject('auth') private auth: AuthHelper,
        @Inject('me') private meService: MeService) {
    }

    ngOnInit() {
        if (this.auth.IsLogin()) {
            this.meService.getCurrentUser()
                .subscribe((user) => {
                    var redirectTo = 'schools';
                    this.router.navigate([redirectTo]);
                });
        }
        else {
            this.router.navigate(['login']);
        }
    }
}