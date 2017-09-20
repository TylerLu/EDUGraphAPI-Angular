/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserInfo } from '../models/common/userInfo';
import { AuthHelper } from "../authHelper/authHelper";

@Injectable()
export class UserService {

    private usersAPIUrl = 'api/users';
    private favoriteColorURL = "/FavoriteColor";
    private loginUrl = '/auth/login/local';
    private registerAPIUrl = 'api/register';

    constructor(
        private _http: Http,
        @Inject('auth') private authService: AuthHelper) {
    }



    public createLocalAccount(userInfo: UserInfo) {
        return this._http.post(this.registerAPIUrl, userInfo)
            .map((response: Response) => response.json());
    }

    public localLogin(userInfo: UserInfo): Promise<any> {
        return this._http.post(this.loginUrl, userInfo)
            .toPromise();
    }

}