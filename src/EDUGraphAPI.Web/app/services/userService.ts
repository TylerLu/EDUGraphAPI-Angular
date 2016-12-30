import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { UserInfo } from '../models/common/userInfo';

@Injectable()
export class UserService {

    private usersAPIUrl = 'api/users';
    private authToken: string;

    constructor(private _http: Http, @Inject('auth') private authService) {
        this.authToken = authService.access_token;
    }

    public unlinkAccount(id:string) {
        return this._http.get(this.usersAPIUrl +'/:'+id+'/unlink', {})
            .map((response: Response) => response.json());
    }

    public getLinkedAccounts() {
        return this._http.get(this.usersAPIUrl + '/linked', {})
            .map((response: Response) => response.json()); 
    } 

    public createLocalAccount(userInfo: UserInfo) {
        return this._http.post(this.usersAPIUrl, userInfo)
            .map((response: Response) => response);
    }
}