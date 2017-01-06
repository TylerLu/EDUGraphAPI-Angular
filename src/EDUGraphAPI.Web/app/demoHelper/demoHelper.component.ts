import { Component, Input, OnInit, Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { DemoHelperPage } from './demoHelperPage';
import { DemoHelperService } from './demoHelperService';
import { MapUtils } from '../services/jsonhelper';


@Component({
    moduleId: module.id,
    selector: 'demohelper',
    templateUrl: 'demoHelper.component.template.html'
})

export class DemoHelper implements OnInit {

    HasDemo: boolean;
    DemoPage: DemoHelperPage;
    Collapsed: boolean;

    constructor(private router: Router, private http: Http, @Inject('demoHelperService') private demoHelperService: DemoHelperService) { }

    ngOnInit() {
        this.HasDemo = true;
        this.Collapsed = true;
        this.DemoPage = new DemoHelperPage();
        this.GetDemoPage();
    }

    showDemoHelper() {
        this.Collapsed = !(this.Collapsed);
    }

    GetDemoPage() {
        this.demoHelperService.GetDemoData()
            .subscribe(res => {
                this.DemoPage = res;
                this.HasDemo = this.DemoPage != {};
                console.log(this.DemoPage);
            });
    }


}