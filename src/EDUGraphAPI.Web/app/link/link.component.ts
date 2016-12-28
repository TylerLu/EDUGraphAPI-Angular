import { Component,  OnInit, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { LinkService } from './link.service';
import { UserInfo } from '../models/common/userinfo';


@Component({
    selector: 'linkPage',
    templateUrl: '/app/link/link.component.template.html',
    styleUrls: ['app/css/bootstrap.min.css','app/css/Site.css']
})

export class Link implements OnInit {
    isAccountsLinked: boolean;
    isLocalAccount: boolean;
    localAccountExisted: boolean;
    localAccountExistedMessage: string;
    userInfo: UserInfo; 


    constructor( @Inject('linkService') private linkService: LinkService, private router: Router, @Inject('me') private meService) { }

    ngOnInit() {
        this.localAccountExistedMessage = '';
        this.isAccountsLinked = this.linkService.isAccountsLinked();
        this.isLocalAccount = this.linkService.isLocalAccount();
        this.userInfo = new UserInfo();
        this.userInfo.email = 'testEmail';
        this.userInfo.o365Email = 'testO365Email';
        this.meService.getCurrentUser()
                      .subscribe((user) => {console.log(user)});
        this.meService.updateFavoriteColor("blue", function () { console.log('updated'); });
    }

    initLocalAccountExisted() {
        this.localAccountExisted = (this.localAccountExistedMessage != undefined || this.localAccountExistedMessage != null || this.localAccountExistedMessage != '');
    }

    loginO365() {
        console.log('login365');
    }

    createLocalAccount() {
        console.log('createLocalAccount');
        this.router.navigate(['createLocalAccount']);
    }

}