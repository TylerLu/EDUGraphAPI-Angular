import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { DemoPage } from './demoPage';


@Component({
    selector: 'demo',
    templateUrl: '/app/demo/demo.component.template.html',
    styleUrls: ['app/css/bootstrap.min.css', 'app/css/Site.css']
})

export class Demo implements OnInit {

    HasDemo: boolean;
    DemoPage: DemoPage;

    constructor(private router: Router, private http: Http,) { }

    ngOnInit() {
        this.HasDemo = true;
        this.DemoPage = new DemoPage();
        this.http.get('app/demo/demo-pages.json').subscribe(res => console.log(res.json()));
    }


}