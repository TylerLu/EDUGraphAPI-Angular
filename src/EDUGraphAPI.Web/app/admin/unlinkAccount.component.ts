import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfo } from '../models/common/userInfo';


@Component({
    selector: '',
    templateUrl: '/app/admin/unlinkAccount.component.template.html',
    styleUrls: []
})

export class UnlinkAccountComponent implements OnInit {
    private sub: any;
    account: UserInfo = new UserInfo();

    constructor( @Inject('user') private userService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.account.id = params['id'];
            //this.account.email = decodeURIComponent(params['email']);
            //this.account.o365Email = decodeURIComponent(params['o365Email']);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    dounLink() {
        this.userService.unlinkAccount(this.account.id)
            .subscribe((status) => {
                console.log(status);
            });
    }

    goBack() {
        this.router.navigate(["linkedAccounts"]);
    }
}
