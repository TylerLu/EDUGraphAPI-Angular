import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { SchoolModel } from '../school/school';
import { SvcConsts } from '../SvcConsts/SvcConsts'
import { UserModel } from '../school/user';
import { AuthorizationHelper, Prompt } from '../utils/AuthorizationHelper';

@Injectable()
export class AdminService {

    private getMeUrl = SvcConsts.AAD_Graph_RESOURCE + '/' + SvcConsts.TENANT_ID + "/me?api-version=1.5";


    constructor(private http: Http, @Inject('auth') private authService, @Inject('data') private dataService) { }


    getAdmin(): any {
        return this.dataService.get(this.getMeUrl)
            .map((response: Response) => <UserModel>response.json());
    }

    consent() {
        var state = this.generateNonce();
        var url = AuthorizationHelper.getUrl('/admin', state, Prompt.AdminConsent);
        window.location.href = url;
    }

    unconsent() {
        // tbd
        console.log('unconsent');
    }

    linkedAccounts(){
        // tbd
        console.log('linkedAccounts');
    }

    addAppRoleAssignments() {
        // tbd
        console.log('addAppRoleAssignments');
    }

    private generateNonce(): string {
        var text = "";
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 32; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return text;
    }

}