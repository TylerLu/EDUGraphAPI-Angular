import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../constants';
import { UserModel } from '../school/user';
import { AuthorizationHelper, Prompt } from '../utils/AuthorizationHelper';

@Injectable()
export class LinkService {

    private linkUrl = 'api/link';
    constructor(private http: Http, @Inject('auth') private authService, @Inject('me') private meService, @Inject('user') private userService) { }


    isLocalAccount() {
        return this.meService.isLocalAccount();
    }

    getCurrentUser() {
        return this.meService.getCurrentUser();
    }

    isEmpty(str: string): boolean {
        return str == undefined || str == '' || str == null;
    }



    linkLocalUser(email:string,password:string) {
        var body = {
            email: email,
            password: password
        };
        return this.http.post(this.linkUrl + "/ExistingLocalUser", body)
            .map((response: Response) => response.json());
    }

    createLocalUser(email: string, password: string, favoriteColor:string) {
        var body = {
            email: email,
            password: password,
            favoriteColor: favoriteColor
        };
        return this.http.post(this.linkUrl + "/CreateLocalUser", body)
            .map((response: Response) => response.json()); 
    }

    linkO365User() {
        var redirectUrl = `${window.location.protocol}//${window.location.host}/api/link/O365User`;
        var url = AuthorizationHelper.getUrl(
            'code+id_token',
            redirectUrl,
            AuthorizationHelper.generateNonce(),
            Constants.MSGraphResource,
            'login',
            AuthorizationHelper.generateNonce(),
            'form_post'
        );
        window.location.href = url;
    }

    getPostBodyWithParams(params:Object) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let urlSearchParams = new URLSearchParams();
        for (var key in params) {
            urlSearchParams.append(key,params[key]);
        }
        let body = urlSearchParams.toString();
        return body;
    }

}