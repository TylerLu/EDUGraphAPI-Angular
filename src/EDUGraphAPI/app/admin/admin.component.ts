import { Component, OnInit, Inject } from '@angular/core';
import { AdminModel } from './admin';
import { MapUtils } from '../services/jsonhelper';
import { AdminService } from './admin.service';


@Component({
    selector: 'admin',
    templateUrl: '/app/admin/admin.component.template.html',
    styleUrls: []
})

export class AdminComponent implements OnInit {

    me: AdminModel;
    IsAdminConsented: boolean;
    constructor( @Inject('adminService') private adminService: AdminService) {

    }

    ngOnInit() {
        this.IsAdminConsented = false;
    }

    consent() {
        this.adminService.consent();
    }

    unconsent() {
        this.adminService.unconsent();
    }

    linkedAccounts() {
        this.adminService.linkedAccounts(); 
    }

    addAppRoleAssignments() {
        this.adminService.addAppRoleAssignments(); 
    }

}
