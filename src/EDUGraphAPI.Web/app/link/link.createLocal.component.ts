/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';
import { CreateLocalModel } from './link';
import { ColorEntity } from '../models/common/colorEntity';
import { Constants } from '../constants';
import { MeService } from "../services/meService";
import { UserService } from "../services/userService";

@Component({
    moduleId: module.id,
    selector: 'link-local',
    templateUrl: 'link.createLocal.component.template.html'
})

export class LinkCreateLocal implements OnInit {

    userInfo: UserInfo;
    localModel: CreateLocalModel;
    favoriteColors: ColorEntity[];
    checkPwdRequired: boolean = true;
    checkConfirmPwdRequried: boolean = true;
    checkPwdEqualConfirmPwd: boolean = true;
    serverCheckValid: boolean = true;
    errorMsgs: string[];

    constructor(
        private router: Router,
        @Inject('linkService') private linkService: LinkService,
        @Inject('me') private meService: MeService,
        @Inject('user') private userService: UserService) { }

    ngOnInit() {
        this.localModel = new CreateLocalModel();
        this.initCurrentUser();
        this.favoriteColors = Constants.FavoriteColors;
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
                if (!this.userInfo.email) {
                    this.userInfo.email = this.userInfo.o365Email;
                }
                if (!this.userInfo.favoriteColor) {
                    this.localModel.favoriteColor = this.favoriteColors[0].Value;
                }
                else {
                    this.localModel.favoriteColor = this.userInfo.favoriteColor;
                }
            });
    }

    checkValid() {
        this.checkPwdRequired = !this.linkService.isEmpty(this.localModel.password);
        this.checkConfirmPwdRequried = !this.linkService.isEmpty(this.localModel.confirmPassword);
        this.checkPwdEqualConfirmPwd = this.localModel.confirmPassword == this.localModel.password;
        return this.checkPwdRequired && this.checkConfirmPwdRequried && this.checkPwdEqualConfirmPwd;
    }

    createLocal() {
        if (!this.checkValid())
            return;
        this.linkService.createLocalUser(this.userInfo.email, this.localModel.password, this.localModel.favoriteColor)
            .subscribe((result) => {
                if (result == 200) {
                    this.router.navigate(["schools"]);
                }
            },
            (err) => {
                this.errorMsgs = [err.json().error]; this.serverCheckValid = false;
            });
    }
}