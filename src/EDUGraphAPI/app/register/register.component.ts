import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';


@Component({
    selector: 'register-form',
    templateUrl: '/app/register/register.component.template.html',
})

export class Register implements OnInit {

     constructor( @Inject('auth') private auth, private router: Router, private activatedRoute: ActivatedRoute) {
    }


    ngOnInit() {
    }



}
