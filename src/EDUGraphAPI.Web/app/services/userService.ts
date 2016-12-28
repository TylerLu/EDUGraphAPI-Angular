import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';




@Injectable()
export class UserService {

    private authToken: string;

    constructor(private _http: Http, @Inject('auth') private authService) {
        this.authToken = authService.access_token;
    }

}