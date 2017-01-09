import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserInfo } from '../models/common/userInfo';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    private usersAPIUrl = 'api/users';
    private loginUrl = '/account/login';
    private registerAPIUrl = 'api/register';
    private authToken: string;

    constructor(private _http: Http, @Inject('auth') private authService) {
        this.authToken = authService.access_token;
    }

    public unlinkAccount(id: string) {
        return this._http.post(`${this.usersAPIUrl}/${id}/unlink`, {})
            .map((response: Response) => {
                return response.ok;
            });
    }

    public getLinkedAccounts() {
        return this._http.get(this.usersAPIUrl + '/linked', {})
            .map((response: Response) => response.json()); 
    } 

    public createLocalAccount(userInfo: UserInfo) {
        return this._http.post(this.registerAPIUrl, userInfo)
            .map((response: Response) => response.json());
    }

    public localLogin(userInfo: UserInfo): Promise<any>{
        return this._http.post(this.loginUrl, userInfo)
            .toPromise();
    }
}