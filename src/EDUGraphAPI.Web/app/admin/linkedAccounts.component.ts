import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MapUtils } from '../services/jsonhelper';
import { UserInfo } from '../models/common/userInfo'


@Component({
    selector: '',
    templateUrl: '/app/admin/linkedAccounts.component.template.html',
    styleUrls: []
})

export class LinkedAccountsComponent implements OnInit {
    accounts: UserInfo[] = new Array<UserInfo>();

    constructor( @Inject('user') private userService, private router: Router) {
    }

    ngOnInit() {
        this.userService.getLinkedAccounts()
            .subscribe((users) => {
                users.forEach((user) => {
                    let account: UserInfo = new UserInfo();
                    account.readFromJson(user);
                    this.accounts.push(account);
                });
            });
    }

    gotoUnlink(userId) {
        this.router.navigate(["unlinkAccount", userId]);
    }

    gotoAdmin() {
        this.router.navigate(["admin"]);
    }
}
