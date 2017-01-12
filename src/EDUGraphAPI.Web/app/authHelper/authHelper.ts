import { Injectable, Inject } from "@angular/core";
import { Constants } from '../constants';
import { Cookie } from '../services/cookieService';
import { Http, Headers, Response } from '@angular/http';
import { MapUtils, JsonProperty } from '../utils/jsonhelper'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';

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

    public getAADGraphToken(): Observable<TokenEntity> {
        return this.get("/api/me/accesstoken?resource=" + encodeURIComponent(Constants.AADGraphResource));
    }
    public getMSGraphToken(): Observable<TokenEntity> {
        return this.get("/api/me/accesstoken?resource=" + encodeURIComponent(Constants.MSGraphResource));
    }

    getHeader() {
        let header = new Headers();
        return header;
    }
    get(actionUrl: string): Observable<TokenEntity> {
        let activeProject: ReplaySubject<any> = new ReplaySubject(1);
        this._http.get(actionUrl, { headers: this.getHeader() })
            .map((response: Response) => <TokenEntity>response.json())
            .subscribe((resp) => {
                activeProject.next(resp);
            },
            (error) => {
                window.location.href = "/link-loginO365Requried";
                activeProject.complete();

            });
        return activeProject;
    }

    login() {
        window.location.href = "/o365login";
    }

}

export class TokenEntity {
    public accessToken: string;
    public error: any;
    public expires: number;
    constructor() {
        this.accessToken = undefined;
        this.error = undefined;
        this.expires = undefined;
    }
}