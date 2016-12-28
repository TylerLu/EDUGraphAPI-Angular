import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { SchoolModel} from '../school/school'
import 'rxjs/add/operator/toPromise';

export class Item {
    public objectType: string; 
    public objectId: string;
    public displayName:string;
}


@Injectable()
export class DataService {

    private authToken: string;
    private msAuthToken: string;

    constructor(private _http: Http, @Inject('auth') private authService) {
        this.authToken = authService.access_token;
        this.msAuthToken = authService.ms_access_token;
    }

    getHeader(token: string) {
        let header = new Headers();
        header.append('Authorization', 'Bearer ' + token); 
        return header;
    }
    getHeaderWithoutToken() {
        let header = new Headers();
        return header;
    }

    public get(actionUrl: string) {
        return this._http.get(actionUrl, { headers: this.getHeader(this.authToken) });
    }
    public post(actionUrl: string, data: any) {
        return this._http.post(actionUrl, data, { headers: this.getHeaderWithoutToken() });
    }

    public getWithMsToken(actionUrl: string) {
        return this._http.get(actionUrl, { headers: this.getHeader(this.msAuthToken) });
    }

    public getWithoutToken(actionUrl: string) {
        return this._http.get(actionUrl);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}