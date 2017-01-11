import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { UrlHelper } from './utils/urlHelper';


@Component({
    moduleId: module.id,
    template: ''
})

export class HomeComponent implements OnInit {

    constructor(private router: Router, @Inject('auth') private auth, private activatedRoute: ActivatedRoute, @Inject('me') private meService) {
    }


    ngOnInit() {
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
                if (this.auth.IsLogin()) {
                    this.meService.getCurrentUser()
                        .subscribe((user) => {
                            if (user.areAccountsLinked) {
                                this.router.navigate(["schools"]);
                            } else {
                                this.router.navigate(["link"]);
                            }

                        });
                }
                else {
                    this.router.navigate(['login']);
                }

            });

    }



}
