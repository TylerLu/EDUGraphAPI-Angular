/*
* Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
* See LICENSE in the project root for license information.
*/
import { DbContext, TokenCacheInstance } from '../data/dbContext';
import * as Promise from "bluebird";
import { TokenUtils } from '../utils/tokenUtils'
import { Constants } from '../constants';

export class TokenCacheService {

    private dbContext = new DbContext();

    public updateMSGToken(oid: string, msgAccessToken?: string, msgRefreshgToken?: string, msgExpires?: number): Promise<any> {
        return this.createOrGetObject(oid)
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
            });
    }

    public updateAADGToken(oid: string, aadgAccessToken?: string, aadgRefreshgToken?: string, aadgExpires?: number): Promise<any> {
        return this.createOrGetObject(oid)
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
            });
    }

    public getTokenCacheByOID(oid: string): Promise<TokenCacheInstance> {
        return this.dbContext.TokenCache.findOne({ where: { oid: oid } });
    }

    public getMSGraphToken(oid: string): Promise<any> {
        return this.getTokenCacheByOID(oid)
            .then((tokenObject) => {
                if (tokenObject == null) {
                    throw 'failed to acquire token';
                }
                else {
                    if ((new Date()).getTime() < tokenObject.msgExpires - 5 * 60 * 1000) {
                        return {
                            accessToken: tokenObject.msgAccessToken,
                            expires: tokenObject.msgExpires
                        };
                    }
                    else {
                        return TokenUtils.getTokenByRefreshToken(tokenObject.msgRefreshgToken, Constants.MSGraphResource)
                            .then((result: any) => {
                                tokenObject.msgAccessToken = result.access_token;
                                tokenObject.msgExpires = result.expires_on * 1000;
                                return tokenObject.save()
                                    .then((ret) => {
                                        return {
                                            accessToken: tokenObject.msgAccessToken,
                                            expires: tokenObject.msgExpires
                                        }
                                    })
                            })
                    }
                }
            })
    }

    public getAADAccessToken(oid: string): Promise<any> {
        return this.getTokenCacheByOID(oid)
            .then((tokenObject) => {
                if (tokenObject == null) {
                    throw 'failed to acquire token';
                }
                else {
                    if ((new Date()).getTime() < tokenObject.aadgExpires - 5 * 60 * 1000) {
                        return {
                            accessToken: tokenObject.aadgAccessToken,
                            expires: tokenObject.aadgExpires
                        }
                    }
                    else {
                        return TokenUtils.getTokenByRefreshToken(tokenObject.aadgRefreshgToken, Constants.AADGraphResource)
                            .then((result: any) => {
                                tokenObject.aadgAccessToken = result.access_token;
                                tokenObject.aadgExpires = result.expires_on * 1000;
                                return tokenObject.save()
                                    .then((ret) => {
                                        return {
                                            accessToken: tokenObject.aadgAccessToken,
                                            expires: tokenObject.aadgExpires
                                        };
                                    })
                            })
                    }
                }
            })
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
}