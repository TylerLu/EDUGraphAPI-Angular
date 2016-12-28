import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import {RegisterModel} from './register'


@Component({
    selector: 'register-form',
    templateUrl: '/app/register/register.component.template.html',
    styles: []
})

export class Register implements OnInit {
    model: RegisterModel = new RegisterModel();

    constructor( @Inject('userService') private userMeservice
        ,private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
    }

    createLocalUser() {

    }
}
