import { Injectable, Inject } from '@angular/core';
import { DemoHelperPage } from './demoHelperPage';
import { Http,Response} from '@angular/http';

@Injectable()
export class DemoHelperService {

    constructor(private http: Http) {}

    GetMappedDemoPage(pages: DemoHelperPage[]) {
        let result = new DemoHelperPage();
        let component = window.location.pathname.split('/')[1];
        for (var i = 0; i < pages.length; i++) {
            let page = pages[i];
            if (page.component == component) {
                result = page;
                break;
            }
        }
        return result;
    }

    GetDemoData(){
        return this.http.get('app/demoHelper/demoHelper-pages.json')
            .map((response: Response) => {
                return this.GetMappedDemoPage(response.json());
            });
    }

}