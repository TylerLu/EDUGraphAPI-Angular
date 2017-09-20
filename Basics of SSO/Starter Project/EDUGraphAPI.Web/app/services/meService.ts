/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UserInfo } from '../models/common/userinfo';
import { Constants } from '../constants';
import { AuthHelper } from "../authHelper/authHelper";

@Injectable()
export class MeService {

    private meAPIUrl = 'api/me';

    constructor(
        private _http: Http,
        @Inject('auth') private authService: AuthHelper) {
    }

    public getCurrentUser() {
        return this._http.get(this.meAPIUrl + '?t=' + new Date().getTime(), {})
            .map((response: Response) => response.json());
    }



}