import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';




@Injectable()
export class MeService {

    private meAPIUrl = 'api/me';

    constructor(private _http: Http, @Inject('auth') private authService) {
    }

    public getCurrentUser() {
        return this._http.get(this.meAPIUrl, {})
            .map((response: Response) => response.json());
    }

    public updateFavoriteColor(favoriteColor: string,doneFn) {
        this.getCurrentUser()
            .subscribe((user) => {
                user.favoriteColor = favoriteColor;
                this._http.post(this.meAPIUrl, user)
                    .map((response: Response) => response)
                    .subscribe(() => { doneFn(); });
            });
    }

}