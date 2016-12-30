import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { AuthenticationHelper } from '../utils/authenticationHelper';


@Component({
    selector: 'loginform',
    templateUrl: '/app/login/login.component.template.html',
    styleUrls: ['app/css/login.css']
})

export class Login implements OnInit {

    private files = [];
    constructor( @Inject('auth') private auth, private router: Router, private activatedRoute: ActivatedRoute) {

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
                    this.router.navigate(['schools']);
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

    login() {
        this.auth.login();

        //AuthenticationHelper.loginAsync().then(() => {
        //    var idToken = AuthenticationHelper.getIdToken();
        //    console.log('id_token' + idToken);
        //});
    }

    gotoRegister() {
        this.router.navigate(["register"]);
    }
}
