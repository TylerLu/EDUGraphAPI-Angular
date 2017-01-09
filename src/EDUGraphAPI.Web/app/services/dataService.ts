import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable, ReplaySubject } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { SchoolModel } from '../school/school'
import 'rxjs/add/operator/toPromise';

export class Item {
    public objectType: string;
    public objectId: string;
    public displayName: string;
}


@Injectable()
export class DataService {

    constructor(private _http: Http, @Inject('auth') private authService
    ) {
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
        let activeProject: ReplaySubject<any> = new ReplaySubject(1);
        let accessTokenGetter: () => any = actionUrl.indexOf("graph.windows.net") >= 0 ? this.authService.getAccessToken : this.authService.getMSAccessToken;
        accessTokenGetter.bind(this.authService)()
            .subscribe((result) => {
                this._http.get(actionUrl, { headers: this.getHeader(result.accesstoken) })
                    .subscribe((data) => {
                        activeProject.next(data);
                    },
                    (error) => {
                        activeProject.error(error);
                    });
            },
            (error) => {
                activeProject.error(error);
            });

         return activeProject;
    }

    public post(actionUrl: string, data: any) {
        return this._http.post(actionUrl, data, { headers: this.getHeaderWithoutToken() });
    }

    public getWithoutToken(actionUrl: string) {
        return this._http.get(actionUrl);
    }

    private handleError(error: Response) {
        return Observable.throw(error.json().error || 'Server error');
    }
}