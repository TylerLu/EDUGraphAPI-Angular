import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';
import { LoginLocalModel } from './link';
import { ColorEntity } from '../models/common/colorEntity';
import { SvcConsts } from '../SvcConsts/SvcConsts';


@Component({
    moduleId: module.id,
    selector: 'link-loginO365Requried',
    templateUrl: 'link.loginO365Required.component.template.html'
})

export class LinkLoginO365Requried implements OnInit {
    userInfo: UserInfo;

    constructor( @Inject('linkService') private linkService: LinkService, private router: Router, @Inject('me') private meService, @Inject('user') private userService) { }

    ngOnInit() {
        this.initCurrentUser();
    }

    initCurrentUser() {
        this.userInfo = new UserInfo();
        this.linkService.getCurrentUser()
            .subscribe((user) => {
                this.userInfo.readFromJson(user);
            });
    }

    reLoginO365() {
        //this.linkService.linkO365User();
        console.log('ReLoginO365');
    }

}