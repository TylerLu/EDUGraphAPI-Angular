import { Injectable, Inject } from '@angular/core';
import { DemoPage } from './demoPage';
import { Http,Response} from '@angular/http';

@Injectable()
export class DemoService {

    constructor(private http: Http) {}

    GetMappedDemoPage(pages: DemoPage[]) {
        let result = new DemoPage();
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
        return this.http.get('app/demo/demo-pages.json')
            .map((response: Response) => {
                return this.GetMappedDemoPage(response.json());
            });
    }

}