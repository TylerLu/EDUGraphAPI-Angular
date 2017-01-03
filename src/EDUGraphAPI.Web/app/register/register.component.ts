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
        this.model.email = "";
        this.model.password = "";
        this.model.ConfirmPassword = "";
        this.model.favoriteColor = this.model.FavoriteColors[0].Value;
    }

    ngOnInit() {
    }

    createLocalUser() {
        this.userService.createLocalAccount(this.model)
            .subscribe((result) => {
                if (result.ok) {
                    this.router.navigate(["link"]);
                }
            });
    }
}
