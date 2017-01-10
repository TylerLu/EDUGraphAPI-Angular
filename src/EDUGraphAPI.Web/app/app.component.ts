import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { Inject } from '@angular/core';
import { MapUtils } from './utils/jsonhelper';
import { UrlHelper } from './utils/urlHelper';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'app.component.template.html',
    styleUrls: ['../app/app.component.css']
})


export class AppComponent implements OnInit{


    constructor(private router: Router, @Inject('auth') private auth, private activatedRoute: ActivatedRoute, @Inject('me') private meService) {
      
    }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map(route => {
                while (route.firstChild)route = route.firstChild;
                return route;
            })
            .filter(route => route.outlet === 'primary')
            .mergeMap(route => route.data)
            .subscribe((event) => {

                //if (AuthenticationHelper.isUserLoggedIn()) {
                //    this.router.navigate([this.router.url]);
                //}
                if (this.auth.IsLogin()) {
                    this.meService.getCurrentUser()
                        .subscribe((user) => {
                            let url = this.router.url;

                            if (user.areAccountsLinked || url.indexOf("admin") >= 0) {
                                if (url == '/')
                                    url = 'schools';
                            } else if (url.indexOf('link') >= 0 && UrlHelper.getUrlQueryValue(url, 'error') != null) {
                                return;
                            }
                            else if (url.indexOf('link') < 0) {
                                url = 'link';
                            }
                            if (this.router.url != '/' + url && this.router.url != "/login")
                                this.router.navigate([url])
                    });
                    
                }
                else {
                    if (this.router.url != "/register") {
                        this.router.navigate(['login']);
                    } else {
                        this.router.navigate(['register']);
                    }
                }

            });
    
    }

      
    integrateJson() {
        MapUtils.deserialize(Object, {});
    }

}