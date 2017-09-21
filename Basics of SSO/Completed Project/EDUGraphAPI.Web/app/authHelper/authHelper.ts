import { Injectable, Inject } from "@angular/core";
import { Constants } from '../constants';
import { Cookie } from '../services/cookieService';
import { Http, Headers, Response } from '@angular/http';
import { MapUtils, JsonProperty } from '../utils/jsonhelper'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';

@Injectable()
export class AuthHelper {

    constructor(
        private router: Router,
        private _http: Http) {
    }

    public IsLogin(): boolean {
        var token = Cookie.get(Constants.AuthType);
        return token && token != "undefined";
    }

    public reLogin() {
        Cookie.delete(Constants.AuthType);
        this.router.navigate(['login']);
    }
    login() {
        window.location.href = "/auth/login/o365";
    }
}