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
    private aadBaseUrl = SvcConsts.AAD_Graph_RESOURCE + '/' + SvcConsts.TENANT_ID;
    
    constructor(private _http: Http, @Inject('auth') private authService, @Inject('data') private dataService) { }


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

    addAppRoleAssignments(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.authService.getAccessToken()
                .subscribe((result) => {
                    let header = new Headers();
                    header.append('Authorization', 'Bearer ' + result.accesstoken);
                    const authOption = { headers: header };
                    const apiVersion = "?api-version=1.6";
                    this._http.get(`${this.aadBaseUrl}/servicePrincipals${apiVersion}&$filter=appId%20eq%20'${SvcConsts.CLIENT_ID}'`, authOption)
                        .map((response: Response) => { return response.json(); })
                        .subscribe((data) => {
                            if (!data || !(data.value instanceof Array) || data.value.length == 0) {
                                resolve({ ok: false, message: "Could not found the service principal. Please provdie the admin consent." });
                            }
                            else {
                                const servicePrincipal = data.value[0];
                                const resourceid = servicePrincipal.objectId;
                                this._http.get(`${this.aadBaseUrl}/users${apiVersion}&$expand=appRoleAssignments`, authOption)
                                    .map((response: Response) => { return response.json(); })
                                    .subscribe((data) => {
                                        const users = data.value;
                                        let promises = new Array<Promise<any>>();
                                        if (users instanceof Array) {
                                            users.forEach((user) => {
                                                if (!user.appRoleAssignments.some((ass) => ass.resourceId === resourceid)) {
                                                    const body = {
                                                        "odata.type": "Microsoft.DirectoryServices.AppRoleAssignment",
                                                        "creationTimestamp": new Date().toISOString(),
                                                        "principalDisplayName": user.displayName,
                                                        "principalId": user.objectId,
                                                        "principalType": "User",
                                                        "ResourceId": resourceid,
                                                        "resourceDisplayName": servicePrincipal.displayName
                                                    };
                                                    promises.push(this._http.post(`${this.aadBaseUrl}/users/${user.objectId}/appRoleAssignments${apiVersion}`, body, authOption).toPromise());
                                                }
                                            });
                                            Promise.all(promises).then(() => resolve({ ok: true, message: `User access was successfully enabled for ${promises.length} users.`}))
                                                .catch(reject);
                                        }
                                        if (promises.length == 0) {
                                            resolve({ ok: true, message: "User access was enabled for all users." });
                                        }
                                    });
                            }
                        });
                    })
                });
    }
}