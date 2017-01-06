﻿import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AuthenticationHelper } from '../utils/authenticationHelper';
import { UserInfo } from '../models/common/userInfo'


@Component({
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id,
    selector: 'loginform',
    templateUrl: 'login.component.template.html',
    //styleUrls: ['../../app/css/login.css']
    styles: [`
        .containerbg{height:100%;}
        .container{width:100% !important;}
        .container.body-content{height :100% !important;}
        .body-content{background-image:url('/app/Images/longin-bg.jpg') ; background-size:cover; margin:0;width:100%;}
        .container>div.row{background-color:transparent;}
        .loginbody{margin:auto;padding:110px 15px 0 15px;max-width:1200px;}
        .loginbody > .row{padding:0 20px 0 65px;}
        .btn-ms-login{border:none;background-color:transparent;background-image:url('/app/Images/SignInWithOffice365-Button.png');width:234px;height:40px;}
        .margin-btm-20{margin-bottom:20px;}
        .margin-left-20{margin-left:20px;}
        .rememberme{margin-left:20px;}
        .btn-local-login{margin: 20px 0 5px 0;text-transform:uppercase;background-color:#237e17;color:white;width:95px;height:33px;text-align:center; font-size:16px;}
        .form-group{margin-bottom:20px;}
        .form-control{border-radius:5px;border:1px solid #acacac;font-size:16px;}
        ::-moz-placeholder { color: #f3f3f3 !important; font-style:italic; }
        ::-webkit-input-placeholder { color:#f3f3f3 !important;font-style:italic; }
        :-ms-input-placeholder { color:#f3f3f3 !important; font-style:italic;}
        .registerlink,.registerlink:hover{color:#4b67f8;font-size:16px;}
        h4{color:#000000;font-size:16px;}
        input::-webkit-input-placeholder, input::-moz-placeholder, input:-ms-input-placeholder, input:-moz-placeholder {
           font-family:'Helvetica Neue LT Std It';
           color:#f3f3f3;
        }
        .navbar-right, .navbar-nav{display:none;}
        #loginForm a{color:#4B67F8;font-size:16px;}
        .logincontrol{width:380px !important;height:36px;max-width:380px;}
        .loginbody .row .col-md-5:nth-child(2){margin-left:85px;}
        .loginbody .row .col-md-5:nth-child(1){margin-left:65px;}

            `]
})

export class Login implements OnInit {

    model: UserInfo = new UserInfo();
    showLoginFailed: boolean = false;
    constructor( @Inject('auth') private auth, private router: Router, private activatedRoute: ActivatedRoute,
        @Inject('user') private userService
    ) {
        this.model.email = "";
        this.model.password = "";

    }


    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                if (this.auth.IsLogin()) {
                    this.router.navigate(['schools']);
                }
                else {
                    if (this.router.url != "/register") {
                        this.router.navigate(['login']);
                    } else {
                        this.router.navigate(['register']);
                    }
                }
            });


    }

    login() {
        this.auth.login();

    }
    localLogin() {
        this.userService.localLogin(this.model)
            .subscribe((result) => {
                if (result.status == "200") {
                    this.router.navigate(["schools"]);
                } else {
                    this.showLoginFailed = true;
                }
            });
    }
    gotoRegister() {
        this.router.navigate(["register"]);
    }
}
