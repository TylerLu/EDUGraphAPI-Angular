import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { SvcConsts } from '../SvcConsts/SvcConsts'
import { UserModel } from '../school/user';
import { AuthorizationHelper, Prompt } from '../utils/AuthorizationHelper';

@Injectable()
export class LinkService {

    constructor(private http: Http, @Inject('auth') private authService, @Inject('me') private meService) { }


    isAccountsLinked(): boolean {
        return true;
    }


    isLocalAccount(): boolean {
        return true;
    }
}