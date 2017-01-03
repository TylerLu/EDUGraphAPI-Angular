import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { SchoolModel } from '../school/school';
import { SvcConsts } from '../SvcConsts/SvcConsts'
import { UserModel } from '../school/user';
import { AuthorizationHelper, Prompt } from '../utils/AuthorizationHelper';
import { Constants } from '../constants'

@Injectable()
export class AdminService {


    private getMeUrl = SvcConsts.AAD_Graph_RESOURCE + '/' + SvcConsts.TENANT_ID + "/me?api-version=1.5";
    private getAdminUrl = '/api/me';

    constructor(private http: Http, @Inject('auth') private authService, @Inject('data') private dataService) { }


    getAdmin(): any {
        return this.dataService.get(this.getAdminUrl)
            .map((response: Response) => <any>response.json());
    }

    getMe(): any {
        return this.dataService.get(this.getMeUrl)
            .map((response: Response) => <UserModel>response.json());
    }

    isAdmin(result): boolean {
        return true;
        //if (!result || !result.roles || result.roles == 'undefined' || result.roles.length == 0) {
        //    return false;
        //}
        //else {
        //    return true;
        //}
    }

    consent() {
        var redirectUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        var url = AuthorizationHelper.getUrl(
            'id_token',
            redirectUrl,
            AuthorizationHelper.generateNonce(),
            Constants.MSGraphResource,
            Prompt.AdminConsent,
            AuthorizationHelper.generateNonce());
        window.location.href = url;
    }

    unconsent() {
        // tbd
        console.log('unconsent');
    }

    linkedAccounts() {
        // tbd
        console.log('linkedAccounts');
    }

    addAppRoleAssignments() {
        // tbd
        console.log('addAppRoleAssignments');
    }
}