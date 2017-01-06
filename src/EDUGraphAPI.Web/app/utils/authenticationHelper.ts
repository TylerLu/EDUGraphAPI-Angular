import { Injectable } from "@angular/core";
import { Constants } from "../constants";
import { Identity, IdToken } from 'kurvejs';

export class AuthenticationHelper {

    private static Identity = new Identity(Constants.ClientId, Constants.TokenProcessorUrl);

    public static loginAsync(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Identity.loginAsync()
                .then(() => resolve(), e => reject(e));
        });
    }

    public static getIdToken(): IdToken {
        return this.Identity.getIdToken();
    }

    public static isUserLoggedIn(): boolean {
        return this.getIdToken() != null;
    }

    public static getAccessTokenAsync(resource: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.Identity.getAccessTokenAsync(resource)
                .then(resolve, reject);
        });
    }

    public static getAADGraphAccessTokenAsync(): Promise<string> {
        return this.getAccessTokenAsync(Constants.AADGraphResource);
    }

    public static getMSGraphAccessTokenAsync(): Promise<string> {
        return this.getAccessTokenAsync(Constants.MSGraphResource);
    }
}