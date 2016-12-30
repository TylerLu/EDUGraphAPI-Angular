import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';
import { CreateLocalModel } from './link';
import { ColorEntity } from '../models/common/colorEntity';
import { SvcConsts } from '../SvcConsts/SvcConsts';


@Component({
    selector: 'link-local',
    templateUrl: '/app/link/link.createLocal.component.template.html',
    styleUrls: ['app/css/bootstrap.min.css', 'app/css/Site.css']
})

export class LinkCreateLocal implements OnInit {
    userInfo: UserInfo;
    localModel: CreateLocalModel;
    favoriteColors: ColorEntity[];
    checkPwdRequired: boolean = true;
    checkConfirmPwdRequried: boolean = true;
    checkPwdEqualConfirmPwd: boolean = true;

    constructor( @Inject('linkService') private linkService: LinkService, private router: Router, @Inject('me') private meService, @Inject('user') private userService) { }

    ngOnInit() {
        this.localModel = new CreateLocalModel();
        this.initCurrentUser();
        this.favoriteColors = SvcConsts.FavoriteColors;
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
                this.localModel.favoriteColor = this.userInfo.favoriteColor;
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
        this.userInfo.favoriteColor = this.localModel.favoriteColor;
        this.userInfo.password = this.localModel.password;
        this.userService.createLocalAccount(this.userInfo);
    }

}