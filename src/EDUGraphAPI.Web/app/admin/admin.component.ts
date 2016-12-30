import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminModel } from './admin';
import { MapUtils } from '../services/jsonhelper';
import { AdminService } from './admin.service';
import { UrlHelper } from '../utils/urlHelper';


@Component({
    selector: 'admin',
    templateUrl: '/app/admin/admin.component.template.html',
    styleUrls: []
})

export class AdminComponent implements OnInit {
    
    me: AdminModel;
    IsAdminConsented: boolean;


    public error: string;
    public message: string;

    constructor( @Inject('adminService') private adminService: AdminService, private router: Router) {

    }

    ngOnInit() {
        this.initMessage();
        this.IsAdminConsented = true;
    }

    consent() {
        this.adminService.consent();
    }

    unconsent() {
        this.adminService.unconsent();
    }

    linkedAccounts() {
        this.router.navigate(["linkedAccounts"]);
    }

    addAppRoleAssignments() {
        this.adminService.addAppRoleAssignments();
    }

    private initMessage() {
        var error_description = UrlHelper.getHashValue('error_description');
        if (error_description && error_description.length > 0) {
            this.error = error_description;
            return;
        }

        var idToken = UrlHelper.getQueryValue('id_token')
        if (idToken != null && idToken.length > 0)
            this.message = 'Admin consented successfully!';

    }



}
