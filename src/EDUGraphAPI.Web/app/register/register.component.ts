import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {RegisterModel} from './register'
import { UserService } from "../services/userService";

@Component({
    moduleId: module.id,
    selector: '',
    templateUrl: 'register.component.template.html',
    styles: []
})

export class Register implements OnInit {
    model: RegisterModel = new RegisterModel();
    duplicatedEmails: string[] = new Array<string>();

    constructor( @Inject('user') private userService: UserService
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
                this.userService.localLogin(this.model.UserInfo)
                    .then((result) => {
                        if (result.status == "200") {
                            window.location.href = "/";
                        } 
                    });

            },
            (response: Response) => {
                const data: any = response.json();
                const email: string = this.model.UserInfo.email;
                if (data.error && data.error === `Email ${email} is used by others`) {
                    if (this.duplicatedEmails.indexOf(email) === -1) {
                        this.duplicatedEmails.push(email);
                    }
                }
            });
    }

    isEmailAvailable() {
        return this.duplicatedEmails.indexOf(this.model.UserInfo.email) === -1;
    }
}
