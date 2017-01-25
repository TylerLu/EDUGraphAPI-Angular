﻿/*
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

    getSchoolId() {
        let urlParts = this.urlParts();
        if (urlParts.length == 3 && (urlParts[0].toLowerCase() == "classes" || urlParts[0].toLowerCase() == "users" || urlParts[0].toLowerCase() == "myclasses"))
            return urlParts[1];
        if (urlParts.length == 4 && (urlParts[0].toLowerCase() == "classdetail"))
            return urlParts[1];
        return '';
    }

    getSchoolIdAlias() {
        let urlParts = this.urlParts();
        if (urlParts.length == 3 && (urlParts[0].toLowerCase() == "classes" || urlParts[0].toLowerCase() == "users" || urlParts[0].toLowerCase() == "myclasses"))
            return urlParts[2];
        if (urlParts.length == 4 && (urlParts[0].toLowerCase() == "classdetail"))
            return urlParts[3];
        return '';
    }
    
    isClassesPage() {
        let urlParts = this.urlParts();
        return urlParts.length > 0 && (urlParts[0].toLowerCase() == "classes" || urlParts[0].toLowerCase() == "classdetail");
    }

    isTeacherStudentsPage() {
        let urlParts = this.urlParts();
        if (urlParts.length == 0 || (urlParts[0].toLowerCase() != "users"))
            return false;
        if (urlParts.length >= 2 && urlParts[0].toLowerCase() == "users")
            return true;
        return false;
    }

    isMyClassesPage() {
        let urlParts = this.urlParts();
        return urlParts.length > 0 && (urlParts[0].toLowerCase() == "myclasses");
    }

    ifShowClassesTeacherStudents() {
        return this.isClassesPage() || this.isTeacherStudentsPage() || this.isMyClassesPage();
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
        this.meService.getCurrentUser()
            .subscribe((user) => {
                this.fullName = (user.areAccountsLinked || user.authType == 'O365')
                    ? (user.firstName + " " + user.lastName)
                    : user.email
                this.isAdmin = this.isUserAdmin(user);
            });
    }

    isUserAdmin(user: UserInfo): boolean {
        let result = false;
        let roles = user.roles;
        if (roles == undefined || roles == null || roles.length == 0)
            return result;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].toLowerCase() == "admin") {
                result = true;
                break;
            }
        }
        return result;
    }

    doLogOff(): void {
        console.log('logOff');
        Cookie.delete(Constants.COOKIE_TOKEN);
        Cookie.delete(Constants.MS_COOKIE_TOKEN);
        window.location.href = '/logout';
    }
}