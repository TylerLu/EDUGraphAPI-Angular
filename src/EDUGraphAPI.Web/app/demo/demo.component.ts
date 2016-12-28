import { Component, Input, OnInit, Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { DemoPage } from './demoPage';
import { DemoService } from './demoService';
import { MapUtils } from '../services/jsonhelper';


@Component({
    selector: 'demo',
    templateUrl: '/app/demo/demo.component.template.html',
    styleUrls: ['app/css/bootstrap.min.css', 'app/css/Site.css']
})

export class Demo implements OnInit {

    HasDemo: boolean;
    DemoPage: DemoPage;
    Collapsed: boolean;

    constructor(private router: Router, private http: Http, @Inject('demoService') private demoService: DemoService) { }

    ngOnInit() {
        this.HasDemo = true;
        this.Collapsed = true;
        this.DemoPage = new DemoPage();
        this.GetDemoPage();
    }

    showDemoHelper() {
        this.Collapsed = !(this.Collapsed);
    }

    GetDemoPage() {
        this.demoService.GetDemoData()
            .subscribe(res => {
                this.DemoPage = res;
                this.HasDemo = this.DemoPage != {};
                console.log(this.DemoPage);
            });
    }


}