import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute  } from '@angular/router';
import { Inject } from '@angular/core';
import { MapUtils } from './services/jsonhelper';
import { AuthenticationHelper } from './utils/authenticationHelper';


@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.template.html',
    styleUrls: ['app/app.component.css']
})


export class AppComponent implements OnInit{


    constructor(private router: Router, @Inject('auth') private auth, private activatedRoute: ActivatedRoute,) {
      
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
                    var url = this.router.url == '/' ? 'schools' : this.router.url;
                    this.router.navigate([url]);
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