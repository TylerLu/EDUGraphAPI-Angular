import { DbContext, TokenCacheInstance } from '../data/dbContext';
import * as Promise from "bluebird";

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
}