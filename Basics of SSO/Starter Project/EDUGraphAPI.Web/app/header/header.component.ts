/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, Input, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../constants';
import { UserInfo } from '../models/common/userinfo';
import { AuthHelper } from "../authHelper/authHelper";
import { MeService } from "../services/meService";
import { Cookie } from "../services/cookieService";
import { UserModel } from '../school/user';

@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: 'header.component.template.html',
})

export class Header implements OnInit {

    @Input() isAuthenticated: boolean;

    ifShowContextMenu: boolean;
    fullName: string;
    isAdmin: boolean;
    userRole: string = "";
    me: UserModel;
    userPhoto: string = "";
    showO365UserInfo: boolean = true;

    constructor(
        private router: Router,
        @Inject('me') private meService: MeService,
        @Inject('auth') private authService: AuthHelper) {
    }

    ngOnInit() {
        this.ifShowContextMenu = false;
        this.initFullName();

    }

    urlParts() {
        var parts = window.location.pathname.split('/');
        var result = [];
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] != '')
                result.push(parts[i]);
        }
        return result;
    }






    showContextMenu() {
        let isLogin = false;
        let urlParts = this.urlParts();
        for (var i = 0; i < urlParts.length; i++) {
            if (urlParts[i].toLowerCase() == "login")
                isLogin = true;
        }
        if (isLogin)
            return;
        this.ifShowContextMenu = !(this.ifShowContextMenu);
    }

    initFullName() {
        if (this.authService.IsLogin()) {
            this.meService.getCurrentUser()
                .subscribe((user) => {
                    this.fullName = (user.authType == 'O365')
                        ? (user.firstName + " " + user.lastName)
                        : user.email
                    this.userRole = "";
                });
        }
    }


    doLogOff(): void {

        window.location.href = '/logout';
    }
}