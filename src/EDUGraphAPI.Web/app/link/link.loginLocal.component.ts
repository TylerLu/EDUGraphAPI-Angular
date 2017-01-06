import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';
import { LoginLocalModel } from './link';
import { ColorEntity } from '../models/common/colorEntity';
import { Constants } from '../constants';

@Component({
    moduleId: module.id,
    selector: 'link-loginLocal',
    templateUrl: 'link.loginLocal.component.template.html'
})

export class LinkLoginLocal implements OnInit {
    userInfo: UserInfo;
    loginLocalModel: LoginLocalModel;
    checkPwdRequired: boolean = true;
    checkEmailRequried: boolean = true;
    errorMsgs: string[];
    serverCheckValid: boolean=true;

    constructor( @Inject('linkService') private linkService: LinkService, private router: Router, @Inject('me') private meService, @Inject('user') private userService) { }

    ngOnInit() {
        this.initCurrentUser();
        this.loginLocalModel = new LoginLocalModel();
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
            });
    }

    checkValid() {
        this.checkPwdRequired = !this.linkService.isEmpty(this.loginLocalModel.password);
        this.checkEmailRequried = !this.linkService.isEmpty(this.loginLocalModel.email);
        return this.checkPwdRequired && this.checkEmailRequried ;
    }

    loginLocal() {
        if (!this.checkValid())
            return;
        this.linkService.linkLocalUser(this.loginLocalModel.email, this.loginLocalModel.password)
            .subscribe(
            (result) => this.router.navigate(["schools"]),
            (err) => { this.errorMsgs = [err.json().error]; this.serverCheckValid = false; });
    }

}