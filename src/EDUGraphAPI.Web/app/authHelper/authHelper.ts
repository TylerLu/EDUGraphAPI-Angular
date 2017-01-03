import { Injectable, Inject } from "@angular/core";
import { SvcConsts } from "../svcConsts/svcConsts";
import { Cookie } from '../services/cookieService';
import { Http, Headers, Response } from '@angular/http';
import { MapUtils } from '../services/jsonhelper'
import { JsonProperty } from '../services/jsonhelper'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthHelper {

    public access_token: string = null;
    public ms_access_token: string = null;

    constructor(private router: Router, private _http: Http) {
    }

    public IsLogin(): boolean {
        var token = Cookie.get(SvcConsts.LOGIN_TOKEN);
        if (token && token != "undefined")
            return true;
        else {
            return false;
        }
    }

    public reLogin() {
        Cookie.delete(SvcConsts.LOGIN_TOKEN);
        this.router.navigate(['login']);
    }

    public getAccessToken() {
        return this.get("/api/getaccesstoken?resource=https%3A%2F%2Fgraph.windows.net")
            .map((response: Response) => <TokenEntity>response.json());
    }
    public getMSAccessToken() {
        return this.get("/api/getaccesstoken?resource=https%3A%2F%2Fgraph.microsoft.com")
            .map((response: Response) => <TokenEntity>response.json());
    }

    getHeader() {
        let header = new Headers();
        return header;
    }
    get(actionUrl: string) {
        return this._http.get(actionUrl, { headers: this.getHeader() });
    }

    login() {
        window.location.href = "/o365login";
    }

}

export class TokenEntity {
    @JsonProperty("accesstoken")
    public accessToken: string;
    @JsonProperty("error")
    public error: string;
    @JsonProperty("expires")
    public expires: number;
    constructor() {
        this.accessToken = undefined;
        this.error = undefined;
        this.expires = undefined;
    }
}