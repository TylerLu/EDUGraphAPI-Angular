import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';

@Component({
    moduleId: module.id,
    template: ''
})

export class HomeComponent implements OnInit {

    constructor(private router: Router, @Inject('auth') private auth, @Inject('me') private meService) {
    }

    ngOnInit() {
        if (this.auth.IsLogin()) {
            this.meService.getCurrentUser()
                .subscribe((user) => {
                    var redirectTo = user.areAccountsLinked ? 'schools' : 'link';
                    this.router.navigate([redirectTo]);
                });
        }
        else {
            this.router.navigate(['login']);
        }
    }
}