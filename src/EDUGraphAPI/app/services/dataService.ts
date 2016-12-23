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

    constructor(private _http: Http, @Inject('auth') private authService) {
        this.authToken = authService.access_token;
    }

    getHeader() {
        let header = new Headers();
        header.append('Authorization', 'Bearer ' + this.authToken); 
        return header;
    }

    public get(actionUrl: string) {
        return this._http.get(actionUrl, { headers: this.getHeader() });
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}