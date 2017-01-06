import { Component, Input, OnInit, Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { DemoHelperPage } from './demoHelperPage';
import { DemoHelperService } from './demoHelperService';
import { MapUtils } from '../utils/jsonhelper';


@Component({
    moduleId: module.id,
    selector: 'demohelper',
    templateUrl: 'demoHelper.component.template.html'
})

export class DemoHelper implements OnInit {

    HasDemo: boolean;
    DemoPage: DemoHelperPage;
    Collapsed: boolean;

    constructor(private router: Router, private http: Http, @Inject('demoHelperService') private demoHelperService: DemoHelperService, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.HasDemo = true;
        this.Collapsed = true;
        this.DemoPage = new DemoHelperPage();
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {
                this.GetDemoPage();
            });
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