import { DbContext, TokenCacheInstance } from '../data/dbContext';
import * as Promise from "bluebird";

var azureADAuthSrv = require('./azureADAuthService');

export class TokenCacheService {
    private dbContext = new DbContext();

    public updateMSGToken(oid: string, msgAccessToken?: string, msgRefreshgToken?: string, msgExpires?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createOrGetObject(oid)
                .then((tokenObject) => {
                    if (msgAccessToken) {
                        tokenObject.msgAccessToken = msgAccessToken;
                    }
                    if (msgRefreshgToken) {
                        tokenObject.msgRefreshgToken = msgRefreshgToken;
                    }
                    if (msgExpires) {
                        tokenObject.msgExpires = msgExpires;
                    }

                    return tokenObject.save();
                })
                .then((tokenObject) => {
                    resolve(tokenObject);
                })
                .catch((err: any) => {
                    reject(err);
                })
        });
    }

    public updateAADGToken(oid: string, aadgAccessToken?: string, aadgRefreshgToken?: string, aadgExpires?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.createOrGetObject(oid)
                .then((tokenObject) => {
                    if (aadgAccessToken) {
                        tokenObject.aadgAccessToken = aadgAccessToken;
                    }
                    if (aadgRefreshgToken) {
                        tokenObject.aadgRefreshgToken = aadgRefreshgToken;
                    }
                    if (aadgExpires) {
                        tokenObject.aadgExpires = aadgExpires;
                    }

                    return tokenObject.save();
                })
                .then((tokenObject) => {
                    resolve(tokenObject);
                })
                .catch((err: any) => {
                    reject(err);
                })
        });
    }

    public getTokenCacheByOID(oid: string): Promise<TokenCacheInstance> {
        return this.dbContext.TokenCache.findOne({ where: { oid: oid } });
    }

    private createOrGetObject(oid: string): Promise<TokenCacheInstance> {
        return this.dbContext.TokenCache.findOne({ where: { oid: oid } })
            .then((tokenObject): Promise<TokenCacheInstance> => {
                if (tokenObject == null) {
                    return this.dbContext.TokenCache.create({
                        oid: oid
                    });
                }
                else {
                    return new Promise<TokenCacheInstance>((resolve, reject) => {
                        resolve(tokenObject);
                    });
                }
            });
    }

    public getMSAccessToken(oid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getTokenCacheByOID(oid)
                .then((tokenObject) => {
                    if ((new Date()).getTime() > tokenObject.msgExpires - 5 * 60 * 1000) {
                        resolve({
                            accesstoken: tokenObject.msgAccessToken,
                            expires: tokenObject.msgExpires
                        });
                    }
                    else {
                        azureADAuthSrv.getAccessTokenViaRefreshToken(tokenObject.msgRefreshgToken).then((result) => {
                            tokenObject.msgAccessToken = result.access_token;
                            tokenObject.msgExpires = result.expires_on * 1000;
                            tokenObject.save();
                            resolve({
                                accesstoken: tokenObject.msgAccessToken,
                                expires: tokenObject.msgExpires
                            });
                        });
                    }
                })
                .catch(reject);
            });
    }

    public getAADAccessToken(oid: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getTokenCacheByOID(oid)
                .then((tokenObject) => {
                    if ((new Date()).getTime() < tokenObject.aadgExpires - 5 * 60 * 1000) {
                        resolve({
                            accesstoken: tokenObject.aadgAccessToken,
                            expires: tokenObject.aadgExpires
                        });
                    }
                    else {
                        azureADAuthSrv.getAccessTokenViaRefreshToken(tokenObject.aadgRefreshgToken).then((result) => {
                            tokenObject.aadgAccessToken = result.access_token;
                            tokenObject.aadgExpires = result.expires_on * 1000;
                            tokenObject.save();
                            resolve({
                                accesstoken: tokenObject.aadgAccessToken,
                                expires: tokenObject.aadgExpires
                            });
                        });
                    }
                })
                .catch(reject);
        });
    }
}