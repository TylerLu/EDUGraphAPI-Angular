﻿/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';
import { LoginLocalModel } from './link';
import { ColorEntity } from '../models/common/colorEntity';
import { Constants } from '../constants';
import { MeService } from "../services/meService";
import { UserService } from "../services/userService";
import { AuthorizationHelper } from '../utils/AuthorizationHelper';
import { UrlHelper } from '../utils/urlHelper';

@Component({
    moduleId: module.id,
    selector: 'link-loginO365Requried',
    templateUrl: 'link.loginO365Required.component.template.html'
})

export class LinkLoginO365Requried implements OnInit {

    userInfo: UserInfo;
    error: string;

    constructor(
        private router: Router,
        @Inject('linkService') private linkService: LinkService,
        @Inject('me') private meService: MeService,
        @Inject('user') private userService: UserService) { }

    ngOnInit() {
        this.initCurrentUser();
        this.initMessage();
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
            });
    }

    reLoginO365() {
        console.log('ReLoginO365');
        // this.router.navigate(["login"]);
        var redirectUrl = `${window.location.protocol}//${window.location.host}/api/me/O365UserLogin`;
        var url = AuthorizationHelper.getUrl(
            'code+id_token',
            redirectUrl,
            AuthorizationHelper.generateNonce(),
            Constants.MSGraphResource,
            'login',
            AuthorizationHelper.generateNonce(),
            'form_post'
        );
        window.location.href = url;
    }

    initMessage() {
        var msg = UrlHelper.getUrlQueryValue(window.location.href, 'error')
        if (msg != null && msg.length > 0) {
            this.error = msg;
        }
    }
}