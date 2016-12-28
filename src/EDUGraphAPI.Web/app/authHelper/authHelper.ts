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
        this.access_token = Cookie.get(SvcConsts.COOKIE_TOKEN);
        this.ms_access_token = Cookie.get(SvcConsts.MS_COOKIE_TOKEN);

        //check for id_token or access_token in url
        if (this.access_token == null) {

            var result = this.get("/api/getaccesstoken?resource=https%3A%2F%2Fgraph.windows.net")
                .map((response: Response) => <TokenEntity>response.json());
                result
                .subscribe((result) => {
                    var tokenEntity = MapUtils.deserialize(TokenEntity, result);
                    if (tokenEntity.accessToken != null && tokenEntity.accessToken != "") {
                        this.access_token = tokenEntity.accessToken;
                        Cookie.set(SvcConsts.COOKIE_TOKEN, this.access_token, tokenEntity.expires);

                        if (this.ms_access_token == null) {
                            var msResult = this.get("/api/getaccesstoken?resource=https%3A%2F%2Fgraph.microsoft.com")
                                .map((response: Response) => <TokenEntity>response.json());
                            msResult
                                .subscribe((result) => {
                                    var tokenEntity = MapUtils.deserialize(TokenEntity, result);
                                    if (tokenEntity.accessToken != null && tokenEntity.accessToken != "") {
                                        this.ms_access_token = tokenEntity.accessToken;
                                        Cookie.set(SvcConsts.MS_COOKIE_TOKEN, this.ms_access_token, tokenEntity.expires);
                                        this.router.navigate(['schools']);
                                    }
                                });
                        }
                    }
                });
        }
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