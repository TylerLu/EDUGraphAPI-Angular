import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {RegisterModel} from './register'


@Component({
    moduleId: module.id,
    selector: '',
    templateUrl: 'register.component.template.html',
    styles: []
})

export class Register implements OnInit {
    model: RegisterModel = new RegisterModel();

    constructor( @Inject('user') private userService
        , private router: Router, private activatedRoute: ActivatedRoute) {
        this.model.UserInfo.email = "";
        this.model.UserInfo.password = "";
        this.model.UserInfo.favoriteColor = this.model.FavoriteColors[0].Value;
        this.model.ConfirmPassword = "";
    }

    ngOnInit() {
    }

    createLocalUser() {
        this.userService.createLocalAccount(this.model.UserInfo)
            .subscribe((result) => {
                if (result.ok) {
                    this.router.navigate(["link"]);
                }
            });
    }
}
