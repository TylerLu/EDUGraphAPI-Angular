import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { UserInfo } from '../models/common/userinfo';
import { Cookie } from './cookieService';
import { SvcConsts } from "../svcConsts/svcConsts"




@Injectable()
export class MeService {

    private meAPIUrl = 'api/me';
    private usersAPIUrl = 'api/users';

    constructor(private _http: Http, @Inject('auth') private authService) {
    }

    public getCurrentUser() {
        return this._http.get(this.meAPIUrl, {})
            .map((response: Response) => response.json());
    }

    public updateFavoriteColor(favoriteColor: string,doneFn) {
        this.getCurrentUser()
            .subscribe((user) => {
                user.favoriteColor = favoriteColor;
                this._http.post(this.meAPIUrl, user)
                    .map((response: Response) => response)
                    .subscribe(() => { doneFn(); });
            });
    }

    public isLocalAccount() {
        let authType = Cookie.get(SvcConsts.LOGIN_TOKEN);
        if (authType == null || authType == undefined)
            return true;
        return authType.toLowerCase() == "o365";
    }

    public isO365Account() {
        return !this.isLocalAccount();
    }
}