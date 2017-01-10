import { Injectable, Inject } from "@angular/core";
import { Constants } from '../constants';
import { Cookie } from '../services/cookieService';
import { Http, Headers, Response } from '@angular/http';
import { MapUtils, JsonProperty } from '../utils/jsonhelper'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthHelper {

    public access_token: string = null;
    public ms_access_token: string = null;

    constructor(private router: Router, private _http: Http) {
    }

    public IsLogin(): boolean {
        var token = Cookie.get(Constants.LOGIN_TOKEN);
        if (token && token != "undefined")
            return true;
        else {
            return false;
        }
    }

    public reLogin() {
        Cookie.delete(Constants.LOGIN_TOKEN);
        this.router.navigate(['login']);
    }

    public getGraphToken(actionUrl: string) {
        return actionUrl.indexOf("graph.windows.net") >= 0
            ? this.getAADGraphToken()
            : this.getMSGraphToken();
    }

    public getAADGraphToken() {
        return this.get("/api/me/accesstoken?resource=" + Constants.AADGraphResource.replace("://", "%3A%2F%2F"))
            .map((response: Response) => <TokenEntity>response.json());
    }
    public getMSGraphToken() {
        return this.get("/api/me/accesstoken?resource=" + Constants.MSGraphResource.replace("://", "%3A%2F%2F"))
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