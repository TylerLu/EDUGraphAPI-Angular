import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SvcConsts } from '../SvcConsts/SvcConsts'
import { UserModel } from '../school/user';
import { AuthorizationHelper, Prompt } from '../utils/AuthorizationHelper';

@Injectable()
export class LinkService {

    constructor(private http: Http, @Inject('auth') private authService, @Inject('me') private meService, @Inject('user') private userService) { }


    areAccountsLinked(): boolean {
        return true;
    }


    isLocalAccount() {
        return this.meService.isLocalAccount();
    }

    getCurrentUser() {
        return this.meService.getCurrentUser();
    }

    isEmpty(str: string): boolean {
        return str == undefined || str == '' || str == null;
    }

}